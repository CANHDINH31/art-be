import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class TopComment {
  @Prop()
  tweetUrl: string;

  @Prop()
  tweetId: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  replies: number;

  @Prop()
  retweets: number;

  @Prop()
  likes: number;

  @Prop()
  views: number;

  @Prop()
  postedTime: string;

  @Prop()
  content: string;

  @Prop()
  hashtags: string[];

  @Prop()
  images: string[];
}

export const TopCommentSchema = SchemaFactory.createForClass(TopComment);

export type TweetDocument = HydratedDocument<Tweet>;

@Schema({ timestamps: true })
export class Tweet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Target' })
  target: string;

  @Prop()
  tweetUrl: string;

  @Prop()
  tweetId: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  replies: number;

  @Prop()
  retweets: number;

  @Prop()
  likes: number;

  @Prop()
  views: number;

  @Prop()
  postedTime: string;

  @Prop()
  content: string;

  @Prop()
  hashtags: string[];

  @Prop()
  images: string[];

  @Prop()
  follower: string;

  @Prop()
  following: string;

  @Prop({ default: 1 })
  status: number;

  @Prop({ type: TopCommentSchema })
  user: TopComment;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
