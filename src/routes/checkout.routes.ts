// src/routes/checkout.routes.ts
import { Router } from 'express';
import { checkout } from '../controllers/checkout.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.post('/', isAuthenticated, checkout);

export default router;
