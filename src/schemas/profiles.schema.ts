import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  appKey: string;

  @Prop()
  appSecret: string;

  @Prop()
  accessToken: string;

  @Prop()
  accessSecret: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
