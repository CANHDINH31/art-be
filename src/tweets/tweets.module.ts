import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/schemas/profiles.schema';
import { Tweet, TweetSchema } from 'src/schemas/tweets.schema';
import { Reply, ReplySchema } from 'src/schemas/replies.schema';
import { Target, TargetSchema } from 'src/schemas/targets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Tweet.name, schema: TweetSchema },
      { name: Reply.name, schema: ReplySchema },
      { name: Target.name, schema: TargetSchema },
    ]),
  ],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
