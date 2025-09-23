import { Request, Response } from 'express';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { Op } from 'sequelize';

// Criar categoria
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, bannerUrl } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
      return;
    }

    const category = await Category.create({ name, bannerUrl });
    res.status(201).json({ message: 'Categoria criada com sucesso!', category });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar categoria', error: err });
  }
};

// Listar todas categorias
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar categorias', error: err });
  }
};

// Buscar uma categoria com seus produtos
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products' }],
    });

    if (!category) {
      res.status(404).json({ message: 'Categoria não encontrada.' });
      return;
    }

    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar categoria', error: err });
  }
};

export const getCategoriesWithProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'imagePath', 'description', 'sizes'],
          through: { attributes: [] },
        },
      ],
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const transformed = categories.map((category) => {
      const raw = category.toJSON();

      return {
        ...raw,
        products: Array.isArray(raw.products)
          ? raw.products.map((product: Product) => ({
              ...product,
              imagePath: `${baseUrl}/uploads/${product.imagePath
                .replace(/^imagePath:/, '')
                .replace(/^\/+/, '')}`,
            }))
          : [],
      };
    });

    res.status(200).json(transformed);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar categorias com produtos',
      error,
    });
  }
};



export const getCategoryByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;

    const category = await Category.findOne({
      where: { name: { [Op.iLike]: name } },
      include: [{ model: Product, through: { attributes: [] } }],
    })
    if (!category) {
      res.status(404).json({ message: 'Categoria não encontrada.' });
      return;
    }

    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar categoria por nome', error: err });
  }
};

// Atualizar categoria
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, bannerUrl } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Categoria não encontrada.' });
      return;
    }

    await category.update({ name, bannerUrl });
    res.status(200).json({ message: 'Categoria atualizada com sucesso!', category });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar categoria', error: err });
  }
};

// Deletar categoria
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Categoria não encontrada.' });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: 'Categoria excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir categoria', error: err });
  }
};
