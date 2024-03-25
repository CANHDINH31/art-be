import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { AiTweetDto } from './dto/ai-tweet.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profiles.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';
import { DownloadService } from 'src/download/download.service';
import { DriveService } from 'src/drive/drive.service';

@Injectable()
export class TweetsService {
  private readonly model;
  private readonly configuration;
  constructor(
    private configService: ConfigService,
    private downloadService: DownloadService,
    private driveService: DriveService,
    @InjectModel(Profile.name) private profileModal: Model<Profile>,
  ) {
    this.configuration = new GoogleGenerativeAI(
      this.configService.get('AI_KEY'),
    );
    this.model = this.configuration.getGenerativeModel({
      model: this.configService.get('AI_MODEl'),
    });
  }
  async ai(aiTweetDto: AiTweetDto) {
    try {
      return await this.model.generateContent(aiTweetDto.prompt);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(file: Express.Multer.File, createTweetDto) {
    try {
      let image;
      if (file) {
        image = await this.driveService.uploadFile(file);
      }

      console.log(image);

      // const profile = await this.profileModal.findOne({
      //   _id: createTweetDto.profileId,
      // });

      // const client = new TwitterApi({
      //   appKey: profile.appKey,
      //   appSecret: profile.appSecret,
      //   accessSecret: profile.accessSecret,
      //   accessToken: profile.accessToken,
      // });

      // await this.downloadService.download(
      //   'https://firebasestorage.googleapis.com/v0/b/lms-education-8bb9c.appspot.com/o/term%2Fterm1.png-1675341314225?alt=media&token=e2c679d6-da7e-43a5-85c2-1fcbd39a9493',
      //   'image.png',
      //   async function () {
      //     try {
      //       const mediaId = await client.v1.uploadMedia('./image.png');
      //       await client.v2.tweet({
      //         text: createTweetDto.content,
      //         media: {
      //           media_ids: [mediaId],
      //         },
      //       });
      //     } catch (e) {
      //       throw e;
      //     }
      //   },
      // );
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all tweets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
