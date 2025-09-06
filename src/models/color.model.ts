// src/models/color.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductColor } from './product-color.model';

@Table({ tableName: 'colors' })
export class Color extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string; // Ex: "Preto", "Vermelho"

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hex!: string; // Ex: "#000000"

  @BelongsToMany(() => Product, () => ProductColor)
  products?: Product[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
