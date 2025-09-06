import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Category } from './category.model';

@Table({
  tableName: 'product_categories',
  timestamps: false,
})
export class ProductCategory extends Model {
  @PrimaryKey
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'product_id' })
  productId!: number;

  @PrimaryKey
  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'category_id' })
  categoryId!: number;
}
