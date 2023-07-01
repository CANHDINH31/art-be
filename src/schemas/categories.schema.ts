import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop()
  url: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Paint' })
  list_paint_id: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
