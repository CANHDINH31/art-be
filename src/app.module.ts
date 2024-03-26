import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PaintsModule } from './paints/paints.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { MailerModule } from '@nest-modules/mailer';
import { RateModule } from './rate/rate.module';
import { CommentsModule } from './comments/comments.module';
import { BullModule } from '@nestjs/bull';
import { OrdersModule } from './orders/orders.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TweetsModule } from './tweets/tweets.module';
import { TargetsModule } from './targets/targets.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_DATABASE_URL'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Tranh tường miền Bắc" <${configService.get('MAIL_FROM')}>`,
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriesModule,
    PaintsModule,
    AuthModule,
    UsersModule,
    RateModule,
    CommentsModule,
    OrdersModule,
    ProfilesModule,
    TweetsModule,
    TargetsModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'rate', method: RequestMethod.POST },
        { path: 'rate/find-one-by-id/(*)', method: RequestMethod.GET },
        { path: 'comments', method: RequestMethod.POST },
        { path: 'comments/(*)', method: RequestMethod.PUT },
        { path: 'comments/(*)', method: RequestMethod.DELETE },
        { path: 'users/favourite/(*)', method: RequestMethod.GET },
        { path: 'users/add-to-cart', method: RequestMethod.POST },
        { path: 'users/update-cart', method: RequestMethod.POST },
        { path: 'auth/me', method: RequestMethod.GET },
        { path: 'users/change-password', method: RequestMethod.POST },
      );
  }
}
