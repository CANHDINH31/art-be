import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TargetDocument = HydratedDocument<Target>;

@Schema({ timestamps: true })
export class Target {
  @Prop()
  keywords: string[];

  @Prop()
  hashtags: string[];

  @Prop()
  views: number;

  @Prop()
  likes: number;

  @Prop()
  shares: number;

  @Prop()
  comments: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: string;
}

export const TargetSchema = SchemaFactory.createForClass(Target);
