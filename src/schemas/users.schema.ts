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

  @Prop()
  age: number;

  @Prop({ default: '1' })
  sex: string;

  @Prop()
  address: string;

  @Prop({ default: 'WEB' })
  provider: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Paint' })
  favourite: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paint' }],
  })
  cart: { paint: mongoose.Schema.Types.ObjectId; amount: number }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
