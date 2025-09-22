// src/models/product.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Category } from './category.model';
import { ProductCategory } from './product-category.model';
import { User } from './user.model';
import { FavoriteProduct } from './favorite-products.model';
import { ProductImage } from './product-image.model';
import { OrderItem } from './order-item.model';
import { Modeling } from './modeling.model';
import { ProductModeling } from './product-modeling.model';
import { Color } from './color.model';
import { ProductColor } from './product-color.model';

@Table({ tableName: 'products' })
export class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'image' })
  imagePath!: string;

  @Column(DataType.STRING)
  measureTableUrl?: string;

  @Column(DataType.STRING)
  fullWidthImageUrl?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFeatured!: boolean;

  @Column(DataType.STRING)
  obs?: string;

  @Column(DataType.STRING)
  sizes?: string;

  @BelongsToMany(() => Category, () => ProductCategory)
  categories?: Category[];

  @BelongsToMany(() => User, () => FavoriteProduct)
  favoritedBy?: User[];

  @BelongsToMany(() => Modeling, () => ProductModeling)
  modelings?: Modeling[];

  @HasMany(() => ProductImage, { onDelete: 'CASCADE' })
  images!: ProductImage[];

  @HasMany(() => OrderItem, { onDelete: 'CASCADE' })
  orderItems!: OrderItem[];

  @BelongsToMany(() => Color, () => ProductColor)
  colors?: Color[];

  public getColors!: () => Promise<Color[]>;
  public setColors!: (colors: Color[] | number[]) => Promise<void>;
  public addColors!: (colors: Color[] | number[]) => Promise<void>;

  // Métodos mágicos das categorias
  public setCategories!: (categories: Category[] | number[]) => Promise<void>;
  public getCategories!: () => Promise<Category[]>;
  public addCategories!: (categories: Category[] | number[]) => Promise<void>;

  public getModelings!: () => Promise<Modeling[]>;
  public setModelings!: (modelings: Modeling[] | number[]) => Promise<void>;
  public addModelings!: (modelings: Modeling[] | number[]) => Promise<void>;

  // Métodos mágicos dos favoritos (opcional)
  public getFavoritedBy?: () => Promise<User[]>;
}
