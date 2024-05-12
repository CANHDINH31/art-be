import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/schemas/profiles.schema';
import { Tweet, TweetSchema } from 'src/schemas/tweets.schema';
import { Reply, ReplySchema } from 'src/schemas/replies.schema';
import { Target, TargetSchema } from 'src/schemas/targets.schema';
import { Access, AccessSchema } from 'src/schemas/accesses.schema';
import { Comment, CommentSchema } from 'src/schemas/comments.schema';
import { Order, OrderSchema } from 'src/schemas/orders.schema';
import { Rate, RateSchema } from 'src/schemas/rates.schema';
import { User, UserSchema } from 'src/schemas/users.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Tweet.name, schema: TweetSchema },
      { name: Reply.name, schema: ReplySchema },
      { name: Target.name, schema: TargetSchema },
      { name: Access.name, schema: AccessSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Rate.name, schema: RateSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
