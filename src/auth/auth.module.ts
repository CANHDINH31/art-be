import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { SendMailConsumer } from './auth.consumer';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({
      name: 'forgot-password',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtService, SendMailConsumer],
})
export class AuthModule {}
