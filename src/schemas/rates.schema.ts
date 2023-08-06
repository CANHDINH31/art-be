import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RateDocument = HydratedDocument<Rate>;

@Schema({ timestamps: true })
export class Rate {
  @Prop()
  value: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Paint' })
  paint_id: string;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
