// models/review-image.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Review } from './review.model';

@Table({ tableName: 'review_images' })
export class ReviewImage extends Model {
  @ForeignKey(() => Review)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' }) 
  reviewId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  url!: string;
} 
