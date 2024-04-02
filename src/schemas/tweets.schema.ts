import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TweetDocument = HydratedDocument<Tweet>;

@Schema({ timestamps: true })
export class Tweet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Target' })
  target: string;

  @Prop({ default: 1 })
  status: number;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
