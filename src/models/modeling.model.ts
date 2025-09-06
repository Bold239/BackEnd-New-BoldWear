// src/models/modeling.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductModeling } from './product-modeling.model';

@Table({ tableName: 'modelings' })
export class Modeling extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @BelongsToMany(() => Product, () => ProductModeling)
  products!: Product[];

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;
}
