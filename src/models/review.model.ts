// models/review.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';
import { ReviewImage } from './review-image.model';

@Table({ tableName: 'reviews' })
export class Review extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rating!: number; // De 1 a 5

  @Column({ type: DataType.TEXT, allowNull: false })
  comment!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product?: Product;

  @HasMany(() => ReviewImage)
  images?: ReviewImage[];
}
