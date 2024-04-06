import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reply } from 'src/schemas/replies.schema';
import { Model } from 'mongoose';

@Injectable()
export class RepliesService {
  constructor(@InjectModel(Reply.name) private replyModal: Model<Reply>) {}
  create(createReplyDto: CreateReplyDto) {
    return 'This action adds a new reply';
  }

  findAll() {
    return `This action returns all replies`;
  }

  async findByTweet(id: string) {
    try {
      return await this.replyModal.findOne({ tweet: id }).populate({
        path: 'tweet',
        populate: {
          path: 'target',
          populate: {
            path: 'profile',
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  update(id: number, updateReplyDto: UpdateReplyDto) {
    return `This action updates a #${id} reply`;
  }

  remove(id: number) {
    return `This action removes a #${id} reply`;
  }
}
