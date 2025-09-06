import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
} from 'sequelize-typescript'

import bcrypt from 'bcrypt'
import { Product } from './product.model'
import { FavoriteProduct } from './favorite-products.model'

@Table({ tableName: 'users' })
export class User extends Model {

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'user' })
  role!: string

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      if (this.favorites && this.favorites.length > 0) {
        return this.favorites.map((p) => p.name).join(', ');
      }
      return '';
    },
  })
  favoriteNames?: string;

  @BelongsToMany(() => Product, () => FavoriteProduct)
  favorites?: Product[]

  public getFavorites!: () => Promise<Product[]>
  public addFavorites!: (products: Product[] | number[]) => Promise<void>

  @BeforeCreate
  static async hashPasswordBeforeCreate(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10)
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10)
    }
  }
}
