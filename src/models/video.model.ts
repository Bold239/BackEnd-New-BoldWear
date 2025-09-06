// src/models/video.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'videos' })
  export class Video extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    url!: string; // caminho do vídeo
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }
  