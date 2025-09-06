// src/routes/video.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { createVideo, getAllVideos, deleteVideo } from '../controllers/video.controller.js';

const router = Router();

router.get('/', getAllVideos);
router.post('/', isAuthenticated, adminAuthMiddleware, createVideo);
router.delete('/:id', isAuthenticated, adminAuthMiddleware, deleteVideo);

export default router;
