import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from './product.model';

@Table({ tableName: 'order_items' })
export class OrderItem extends Model {
  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId!: number;
  
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  productId!: number;

  @BelongsTo(() => Order, { onDelete: 'CASCADE' })
  order!: Order;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product!: Product;

  @Column(DataType.INTEGER)
  quantity!: number;

  @Column(DataType.FLOAT)
  price!: number;

  @Column(DataType.STRING)
  size?: string;

  @Column(DataType.STRING)
  model?: string;

  @Column(DataType.STRING)
  color?: string;

  @Column(DataType.STRING)
  obs?: string;

  @Column(DataType.STRING)
  imagePath?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
