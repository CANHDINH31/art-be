import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccessDocument = HydratedDocument<Access>;

@Schema({ timestamps: true })
export class Access {
  @Prop()
  visit: string;

  @Prop()
  amount: number;
}

export const AccessSchema = SchemaFactory.createForClass(Access);
