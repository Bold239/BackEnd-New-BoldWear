// src/models/order.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { OrderItem } from './order-item.model';

@Table({ tableName: 'orders' })
export class Order extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => OrderItem)
  items!: OrderItem[];

  @Column(DataType.STRING)
  paymentMethod!: string; // ex: 'pix', 'card', 'boleto'

  @Column(DataType.STRING)
  status!: string; // ex: 'pending', 'approved', 'rejected'

  @Column(DataType.FLOAT)
  total!: number;

  @Column(DataType.STRING)
  shippingAddress!: string;

  @Column(DataType.STRING)
  recipientName!: string;

  @Column(DataType.STRING)
  recipientCPF!: string;

  @Column(DataType.STRING)
  recipientCEP!: string;

  @Column(DataType.TEXT)
  extraInfo?: string; // campo opcional para observações adicionais

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Column(DataType.FLOAT)
  freight!: number;
}
