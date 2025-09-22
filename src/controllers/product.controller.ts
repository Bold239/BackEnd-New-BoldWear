
import { Request, Response } from 'express'
import { Product } from '../models/product.model.js'
import { Op } from 'sequelize'
import { Category } from '../models/category.model.js'
import { ProductImage } from '../models/product-image.model.js'
import { OrderItem } from '../models/order-item.model.js'
import { Review } from '../models/review.model.js'
import { FavoriteProduct } from '../models/favorite-products.model.js'
import { ModelPhoto } from '../models/model-photo.model.js'
import { Modeling } from '../models/modeling.model.js'
import { Color } from '../models/color.model.js'

export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, price, description, imagePath, categories, model, color, obs, sizes } = req.body;

    if (!name || !price || !description || !imagePath) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
    }

    const product = await Product.create({ name, price, description, imagePath, model, color, obs, sizes })

    if (categories && Array.isArray(categories)) {
      const foundCategories = await Category.findAll({ where: { id: categories } })
      await product.setCategories(foundCategories)
    }

    return res.status(201).json({ message: 'Produto criado com sucesso!', product })
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao criar produto', error: err })
  }
}

export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'categories' }]
    })
    return res.status(200).json({ products })
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar produtos', error: err })
  }
}

export const getFeaturedProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.findAll({
      where: { isFeatured: true },
      include: [ProductImage],
    })

    return res.status(200).json(products)
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar lançamentos', error: err })
  }
}
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories' },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const transformedImages = product.images?.map((img) => ({
      ...img.toJSON(),
      url: `${baseUrl}/uploads/${img.url}`,
    }));

    const transformedProduct = {
      ...product.toJSON(),
      images: transformedImages,
    };

    return res.status(200).json({ product: transformedProduct });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
export const getModelPhotosByProduct = async (req: Request, res: Response): Promise<Response> => {
  const productId = Number(req.params.id);

  try {
    const photos = await ModelPhoto.findAll({
      where: { productId },
      include: [{ model: Modeling, attributes: ['id', 'name'] }],
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const transformed = photos.map((photo) => ({
      ...photo.toJSON(),
      url: photo.url.startsWith('http') ? photo.url : `${baseUrl}${photo.url.startsWith('/') ? '' : '/'}${photo.url}`
    }));

    return res.json(transformed);
  } catch (error) {
    console.error('Erro ao buscar model photos:', error);
    return res.status(500).json({ error: 'Erro ao buscar model photos.' });
  }
};


export const getColorsByProduct = async (req: Request, res: Response): Promise<Response> => {
  const productId = Number(req.params.id);

  try {
    const product = await Product.findByPk(productId, {
      include: [{ model: Color, through: { attributes: [] } }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json(product.colors);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar cores do produto.', error: err });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query, page = 1, limit = 10 } = req.query

    const search = query?.toString().trim() || ''
    const currentPage = parseInt(page as string, 10)
    const pageSize = parseInt(limit as string, 10)

    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${search}%` }
      },
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    })

    return res.status(200).json({ products })
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar produtos', error: err })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params
    const { name, price, description, imagePath, model, color, obs, sizes } = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    await product.update({ name, price, description, imagePath, model, color, obs, sizes })
    return res.status(200).json({ message: 'Produto atualizado com sucesso!', product })
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar produto', error: err })
  }
}

export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const usedInOrders = await OrderItem.findOne({ where: { productId: id } })
    if (usedInOrders) {
      return res.status(400).json({ message: 'Não é possível excluir: produto já foi vendido.' })
    }

    await product.$set('categories', [])
    await product.$set('favoritedBy', [])
    await ProductImage.destroy({ where: { productId: id } })
    await Review.destroy({ where: { productId: id } })
    await FavoriteProduct.destroy({ where: { productId: id } })

    await product.destroy()
    return res.status(200).json({ message: 'Produto excluído com sucesso!' })
  } catch (err) {
    console.error('Erro ao excluir produto:', err)
    return res.status(500).json({ message: 'Erro ao excluir produto', error: err })
  }
}
