import { Request, Response } from "express";
import { Video } from "../models/video.model";

export async function createVideo(req: Request, res: Response): Promise<void> {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      res.status(400).json({ message: "Título e URL são obrigatórios." });
      return;
    }

    const video = await Video.create({ title, url });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar vídeo", error: err });
  }
}

export async function getAllVideos(_req: Request, res: Response): Promise<void> {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar vídeos", error: err });
  }
}

export async function deleteVideo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      res.status(404).json({ message: "Vídeo não encontrado." });
      return;
    }

    await video.destroy();
    res.status(200).json({ message: "Vídeo excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir vídeo", error: err });
  }
}
