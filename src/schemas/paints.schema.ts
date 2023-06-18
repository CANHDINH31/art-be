import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaintDocument = HydratedDocument<Paint>;

@Schema({ timestamps: true })
export class Paint {
  @Prop()
  url: string;

  @Prop()
  title: string;
}

export const PaintSchema = SchemaFactory.createForClass(Paint);
