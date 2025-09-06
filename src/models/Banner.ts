// models/Banner.ts
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "banners" })
export class Banner extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  imageUrl!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  titulo?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  tituloPrincipal?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  destaque?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  subtitulo?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  cupom?: string;
}
