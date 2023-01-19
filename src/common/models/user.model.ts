import { Column, DataType, Model, Table } from "sequelize-typescript";

const { INTEGER, STRING } = DataType

interface UserCreationAttrs {
   name: string
   tgId: string
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
   @Column({
      type: INTEGER,
      unique: true, autoIncrement: true, primaryKey: true
   }) id: number

   @Column({
      type: STRING, allowNull: false
   }) name: string

   @Column({
      type: STRING, allowNull: false
   }) tgId: string
}