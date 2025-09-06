// src/models/product-color.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Color } from './color.model';

@Table({ tableName: 'product_colors' })
export class ProductColor extends Model {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  productId!: number;

  @ForeignKey(() => Color)
  @Column({ type: DataType.INTEGER })
  colorId!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
