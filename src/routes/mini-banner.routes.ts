// src/routes/mini-banner.routes.ts
import { Router } from 'express';
import { getMiniBanner } from '../controllers/mini-banner.controller.js';

const router = Router();
router.get('/', getMiniBanner);
export default router;
