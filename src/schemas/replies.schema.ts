import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ReplyDocument = HydratedDocument<Reply>;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' })
  tweet: string;

  @Prop()
  comment: string;

  @Prop()
  tweetId: string;

  @Prop({ default: 0 })
  replies: number;

  @Prop({ default: 0 })
  retweets: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  reCrawl: number;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
