import { Column, DataType, Model, Table } from "sequelize-typescript";

const { INTEGER, STRING } = DataType

interface ChannelCreationAttrs {
   channelId: string
}

@Table({ tableName: 'channels' })
export class Channel extends Model<Channel, ChannelCreationAttrs> {
   @Column({
      type: INTEGER,
      unique: true, autoIncrement: true, primaryKey: true
   }) id: number

   @Column({
      type: STRING, allowNull: false
   }) channelId: string
}