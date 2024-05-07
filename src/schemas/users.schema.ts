import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  visit: string;

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

  @Prop(
    raw([
      {
        amount: { type: Number },
        paint: { type: mongoose.Schema.Types.ObjectId, ref: 'Paint' },
      },
    ]),
  )
  cart: { amount: number; paint: mongoose.Schema.Types.ObjectId }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
