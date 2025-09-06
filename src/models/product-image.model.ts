import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Product } from './product.model'

@Table({ tableName: 'product_images' })
export class ProductImage extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  })
  productId!: number
}
