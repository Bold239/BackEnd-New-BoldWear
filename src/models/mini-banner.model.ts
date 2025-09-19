// src/models/mini-banner.model.ts
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'mini_banners' })
export class MiniBanner extends Model {
  @Column({ type: DataType.STRING, allowNull: true })
  imageUrl?: string;
}
