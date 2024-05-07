import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Access, AccessSchema } from 'src/schemas/accesses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Access.name, schema: AccessSchema }]),
  ],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
