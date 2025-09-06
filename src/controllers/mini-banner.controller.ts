// src/controllers/mini-banner.controller.ts
import { Request, Response } from 'express';
import { MiniBanner } from '../models/mini-banner.model.js';

export const getMiniBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await MiniBanner.findOne({ order: [['createdAt', 'DESC']] });

    if (!banner) {
      res.status(404).json({ message: 'Nenhum mini banner encontrado' });
      return;
    }

    res.json({ imageUrl: banner.imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mini banner', error });
  }
};
