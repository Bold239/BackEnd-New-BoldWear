// models/Banner.ts
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "banners" })
export class Banner extends Model {
  @Column({ type: DataType.STRING, allowNull: true })
  imageUrl?: string;

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

  @Column({ type: DataType.STRING, allowNull: true })
  mimeType?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  size?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  filename?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  bucket?: string;

}
