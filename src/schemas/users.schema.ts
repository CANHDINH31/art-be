import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  image: string;

  @Prop({ default: 'WEB' })
  provider: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Paint' })
  favourite: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
