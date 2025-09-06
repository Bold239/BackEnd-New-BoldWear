import { Router } from 'express'
import { getUserOrders, getOrderById } from '../controllers/order.controller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'

const router = Router()

router.get('/', isAuthenticated, getUserOrders)
router.get('/:id', isAuthenticated, getOrderById)

export default router
