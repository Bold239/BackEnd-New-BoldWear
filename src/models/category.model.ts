import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { ProductCategory } from './product-category.model';

@Table({
  tableName: 'categories',
})
export class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  bannerUrl?: string; 

  @BelongsToMany(() => Product, () => ProductCategory)
  products?: Product[];

  public getProducts!: () => Promise<Product[]>;
  public setProducts!: (products: Product[] | number[]) => Promise<void>;
  public addProducts!: (products: Product[] | number[]) => Promise<void>;
}
