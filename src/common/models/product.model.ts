import { Column, DataType, Model, Table } from "sequelize-typescript";

const { INTEGER, STRING } = DataType

interface ProductCreationAttrs {
   title: string
   url: string
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
   @Column({
      type: INTEGER,
      unique: true, autoIncrement: true, primaryKey: true
   }) id: number

   @Column({
      type: STRING, allowNull: false
   }) title: string

   @Column({
      type: STRING, allowNull: false
   }) url: string
}