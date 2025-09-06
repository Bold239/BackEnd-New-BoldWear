// src/models/model-photo.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Modeling } from './modeling.model';

@Table({ tableName: 'model_photos' })
export class ModelPhoto extends Model {
  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => Modeling)
  @Column(DataType.INTEGER)
  modelingId!: number;

  @BelongsTo(() => Modeling)
  modeling!: Modeling;

  @Column({ type: DataType.STRING, allowNull: false })
  url!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
