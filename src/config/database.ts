import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductCategory } from '../models/product-category.model';
import { FavoriteProduct } from '../models/favorite-products.model';
import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Video } from '../models/video.model';
import { ProductImage } from '../models/product-image.model';
import { Review } from '../models/review.model';
import { ReviewImage } from '../models/review-image.model';
import { Banner } from '../models/Banner';
import { MiniBanner } from '../models/mini-banner.model';
import { ProductModeling } from '../models/product-modeling.model';
import { Modeling } from '../models/modeling.model';
import { ModelPhoto } from '../models/model-photo.model';
import { Color } from '../models/color.model';
import { ProductColor } from '../models/product-color.model';

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  models: [
    User,
    Product,
    Category,
    ProductCategory,
    FavoriteProduct,
    CartItem,
    Order,
    OrderItem,
    Video,
    ProductImage,
    Review,
    ReviewImage,
    Banner,
    MiniBanner,
    ProductModeling,
    Modeling,
    ModelPhoto,
    Color,
    ProductColor,
  ],
});