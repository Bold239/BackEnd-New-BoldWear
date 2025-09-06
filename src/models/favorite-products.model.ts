import {
  Table,
  Column,
  Model,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';

@Table({
  tableName: 'favorite_products',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'],
    },
  ],
})
export class FavoriteProduct extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId!: number;

  @PrimaryKey
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  productId!: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE' as const,
  })
  user?: User;

  @BelongsTo(() => Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE' as const,
  })
  product?: Product;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}
