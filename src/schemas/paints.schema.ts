import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaintDocument = HydratedDocument<Paint>;

@Schema({ timestamps: true })
export class Paint {
  @Prop()
  url: string;

  @Prop()
  title: string;

  @Prop({ default: 0 })
  total_score: number;

  @Prop({ default: 0 })
  account_users_rate: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  price: number;
}

export const PaintSchema = SchemaFactory.createForClass(Paint);
