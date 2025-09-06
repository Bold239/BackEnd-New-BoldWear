import { Router } from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorite.controller"

const router = Router()

router.get("/", isAuthenticated, getFavorites)
router.post("/:productId", isAuthenticated, addFavorite)
router.delete("/:productId", isAuthenticated, removeFavorite)

export default router
