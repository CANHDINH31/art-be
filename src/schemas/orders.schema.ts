import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  note: string;

  @Prop()
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop(
    raw([
      {
        amount: { type: Number },
        paint: { type: mongoose.Schema.Types.ObjectId, ref: 'Paint' },
      },
    ]),
  )
  cart: { amount: number; paint: mongoose.Schema.Types.ObjectId }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
