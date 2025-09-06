import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
  getFeaturedProducts,
  getModelPhotosByProduct,
  getColorsByProduct
} from '../controllers/product.controller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js'

const router = Router()

router.post('/', isAuthenticated, adminAuthMiddleware, (req, res) => { createProduct(req, res) })
router.get('/', (req, res) => { getAllProducts(req, res) })
router.get('/search', (req, res) => { searchProducts(req, res) })
router.get('/featured', (req, res) => { getFeaturedProducts(req, res) })
router.get('/:id', (req, res) => { getProductById(req, res) })
router.get('/:id/model-photos', (req, res) => { getModelPhotosByProduct(req, res) })
router.get('/:id/colors', (req, res) => { getColorsByProduct(req, res) })
router.put('/:id', isAuthenticated, adminAuthMiddleware, (req, res) => { updateProduct(req, res) })
router.delete('/:id', isAuthenticated, adminAuthMiddleware, (req, res) => { deleteProduct(req, res) })


export default router
