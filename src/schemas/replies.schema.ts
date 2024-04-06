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
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
