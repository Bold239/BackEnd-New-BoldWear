// src/controllers/review.controller.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Review } from '../models/review.model';
import { ReviewImage } from '../models/review-image.model';
import { User } from '../models/user.model';

const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      res.status(400).json({ message: 'Produto e nota são obrigatórios.' });
      return;
    }

    const review = await Review.create({ userId, productId, rating, comment });

    const images = req.body.images as string[] | undefined;
    if (images && images.length > 0) {
      const reviewImages = images.map((url) => ({
        reviewId: review.id,
        url,
      }));
      await ReviewImage.bulkCreate(reviewImages);
    }

    res.status(201).json({ message: 'Review criado com sucesso!', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar review.' });
  }
};

const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, minRating, maxRating } = req.query;

    const where: any = { productId };

    if (rating) {
      where.rating = rating;
    } else {
      if (minRating) {
        where.rating = { ...where.rating, [Op.gte]: Number(minRating) };
      }
      if (maxRating) {
        where.rating = { ...where.rating, [Op.lte]: Number(maxRating) };
      }
    }

 const reviews = await Review.findAll({
  where,
  include: [
    { model: ReviewImage },
    { model: User, attributes: ['name'] } // ✅ inclui apenas o nome do usuário
  ],
  order: [['createdAt', 'DESC']],
});

    const total = await Review.count({ where: { productId } });

    res.status(200).json({ reviews, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reviews.' });
  }
};


const uploadReviewImageController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
      return;
    }

    const imageUrl = `/reviews/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar imagem da review.' });
  }
};

const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const review = await Review.findOne({ where: { id, userId } });

    if (!review) {
      res.status(404).json({ message: 'Review não encontrado.' });
      return;
    }

    await review.destroy();
    res.status(200).json({ message: 'Review removido com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover review.' });
  }
};

export {
  createReview,
  getReviewsByProduct,
  deleteReview,
  uploadReviewImageController,
};
