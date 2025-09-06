import { Request, Response } from 'express';
import { CartItem } from '../models/cart-item.model.js';
import { Product } from '../models/product.model.js';

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1, size, color, obs, modelingId } = req.body;
    const userId = req.user!.id;

    const [item, created] = await CartItem.findOrCreate({
      where: { userId, productId, size },
      defaults: {
        quantity,
        color,
        obs,
        modelingId,
      },
    });

    if (!created) {
      item.quantity += quantity;

      // Atualiza os campos extras se forem diferentes
      if (color) item.color = color;
      if (obs) item.obs = obs;
      if (modelingId) item.modelingId = modelingId;

      await item.save();
    }

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar item ao carrinho.' });
  }
};

export const getCartItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const items = await CartItem.findAll({
      where: { userId },
      include: [Product],
    });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carrinho.' });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity, size } = req.body;
    const userId = req.user!.id;

    const item = await CartItem.findOne({ where: { id, userId } });
    if (!item) {
      res.status(404).json({ message: 'Item não encontrado.' });
      return;
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (size !== undefined) item.size = size;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar item do carrinho.' });
  }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const item = await CartItem.findOne({ where: { id, userId } });
    if (!item) {
      res.status(404).json({ message: 'Item não encontrado.' });
      return;
    }

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
  }
};

export const removeCartItemByProductAndSize = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, size } = req.body;
    const userId = req.user!.id;

    if (!productId || !size) {
      res.status(400).json({ message: 'productId e size são obrigatórios.' });
      return;
    }

    await CartItem.destroy({
      where: {
        userId,
        productId,
        size,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await CartItem.destroy({
      where: { userId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao limpar o carrinho.' });
  }
};
