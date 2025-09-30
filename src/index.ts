import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { sequelize } from './config/database.js';
import { createDefaultAdmin } from './config/createDefaultAdmin.js';
import { adminJs, adminRouter } from './admin/admin.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import cartRoutes from './routes/cart.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import orderRoutes from './routes/order.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import videoRoutes from "./routes/video.routes.js";
import reviewRoutes from './routes/review.routes.js';
import freightRoutes from './routes/freight.routes.js';
import bannerRoutes from "./routes/banner.routes.js";
import miniBannerRoutes from './routes/mini-banner.routes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware JSON
app.use(express.json());

// CORS global (inclui frontend + AdminJS)
app.use(cors({
  origin: ['https://www.boldwears.com.br'],
  credentials: true,
}));

// AdminJS
app.use(adminJs.options.rootPath, adminRouter);

// Pastas públicas
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));
app.use('/reviews', express.static(path.join(__dirname, '..', 'public', 'reviews')));
app.use('/exports', express.static(path.join(__dirname, '..', 'public', 'exports')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);
app.use('/webhook', webhookRoutes);
app.use('/videos', videoRoutes);
app.use('/reviews', reviewRoutes);
app.use('/freight', freightRoutes);
app.use(bannerRoutes);
app.use('/mini-banner', miniBannerRoutes);

// Inicializa
const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    await createDefaultAdmin();

    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const port = Number(process.env.PORT) || 3333;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${port} 🚀`);
    });
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
};

start();
