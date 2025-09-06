import { Request, Response, NextFunction } from "express"
import { FavoriteProduct } from "../models/favorite-products.model"
import { Product } from "../models/product.model"

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id

    const favorites = await FavoriteProduct.findAll({
      where: { userId },
      include: [Product],
    })

    res.json(favorites.map((fav) => fav.product))
  } catch (error) {
    next(error)
  }
}


export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const productId = parseInt(req.params.productId)

    const favorito = await FavoriteProduct.create({ userId, productId })
    res.status(201).json(favorito)
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Produto já está nos favoritos" })
    } else {
      next(error)
    }
  }
}

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const productId = Number(req.params.productId)

    if (isNaN(productId)) {
      res.status(400).json({ message: "ID do produto inválido." })
      return
    }
    const deleted = await FavoriteProduct.destroy({
      where: { userId, productId },
    })

    if (deleted) {
      res.status(200).json({ message: "Removido dos favoritos" })
    } else {
      res.status(404).json({ message: "Produto não estava nos favoritos" })
    }
  } catch (error) {
    next(error)
  }
}
