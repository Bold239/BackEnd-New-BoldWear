import { Router, RequestHandler } from "express"
import { getAllBanners } from "../controllers/banner.controller"

const router = Router()

router.get("/banners", getAllBanners as RequestHandler) 

export default router
