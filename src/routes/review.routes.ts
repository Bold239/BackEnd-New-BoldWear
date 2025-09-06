import { Router } from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import {
  createReview,
  getReviewsByProduct,
  uploadReviewImageController, 
} from '../controllers/review.controller'
import { uploadReviewImage } from '../middlewares/uploadReviewImage'

const router = Router()

// Criar comentário com nota
router.post('/', isAuthenticated, createReview)

// Buscar comentários de um produto
router.get('/product/:productId', getReviewsByProduct)

router.post(
  '/upload',
  isAuthenticated,
  uploadReviewImage.single('image'),
  uploadReviewImageController
)

export default router
