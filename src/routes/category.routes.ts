import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesWithProducts,
  getCategoryByName,
} from '../controllers/category.controller.js';

const router = Router();

router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/categories-with-products', getCategoriesWithProducts);
router.get('/name/:name', getCategoryByName);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
