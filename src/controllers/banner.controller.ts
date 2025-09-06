// src/controllers/banner.controller.ts
import { Request, Response } from "express";
import { Banner } from "../models/Banner";

export async function getAllBanners(req: Request, res: Response): Promise<void> {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    res.status(500).json({ error: "Erro ao buscar banners" });
  }
}
