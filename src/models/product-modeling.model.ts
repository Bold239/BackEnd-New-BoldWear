// src/models/product-modeling.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Modeling } from './modeling.model';

@Table({ tableName: 'product_modelings', timestamps: false })
export class ProductModeling extends Model {
  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId!: number;

  @ForeignKey(() => Modeling)
  @Column(DataType.INTEGER)
  modelingId!: number;
} 
