// src/models/cart-item.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';
import { Modeling } from './modeling.model';

@Table({ tableName: 'cart_items' })
export class CartItem extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  size?: string; // opcional

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Modeling)
  @Column(DataType.INTEGER)
  modelingId?: number;

  @Column(DataType.STRING)
  color?: string;

  @Column(DataType.STRING)
  obs?: string;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product?: Product;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
