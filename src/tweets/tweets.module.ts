import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/schemas/profiles.schema';
import { DownloadService } from 'src/download/download.service';
import { DriveService } from 'src/drive/drive.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [TweetsController],
  providers: [TweetsService, DownloadService, DriveService],
})
export class TweetsModule {}
