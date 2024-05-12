import { Module } from '@nestjs/common';
import { SatisticalService } from './satistical.service';
import { SatisticalController } from './satistical.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Rate, RateSchema } from 'src/schemas/rates.schema';
import { Order, OrderSchema } from 'src/schemas/orders.schema';
import { Comment, CommentSchema } from 'src/schemas/comments.schema';
import { Access, AccessSchema } from 'src/schemas/accesses.schema';
import { Paint, PaintSchema } from 'src/schemas/paints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paint.name, schema: PaintSchema },
      { name: Access.name, schema: AccessSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Rate.name, schema: RateSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  controllers: [SatisticalController],
  providers: [SatisticalService],
})
export class SatisticalModule {}
