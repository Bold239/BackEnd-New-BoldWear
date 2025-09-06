import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  removeCartItemByProductAndSize,
  clearCart
} from '../controllers/cart.controller.js';

const router = Router();

router.use(isAuthenticated);
router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/', isAuthenticated, removeCartItemByProductAndSize);
router.delete('/all', isAuthenticated, clearCart);
router.patch('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

export default router;