import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/orders.schema';
import { OrderConsumer } from './orders.consumer';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BullModule.registerQueue({
      name: 'orders',
    }),
    HttpModule,
  ],
})
export class OrdersModule {}
