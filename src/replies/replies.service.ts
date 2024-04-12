import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reply } from 'src/schemas/replies.schema';
import { Model } from 'mongoose';

@Injectable()
export class RepliesService {
  constructor(@InjectModel(Reply.name) private replyModal: Model<Reply>) {}

  async sync(body) {
    try {
      for (const reply of body.data) {
        const existReply = await this.replyModal.findOne({
          tweetId: reply.tweetId,
        });

        await this.replyModal.findByIdAndUpdate(existReply._id, {
          ...reply,
          lastCrawl: new Date(),
        });
      }

      return {
        status: HttpStatus.CREATED,
        message: 'Lưu reply thành công',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  create(createReplyDto: CreateReplyDto) {
    return 'This action adds a new reply';
  }

  async findAll(pageSize = 10, page = 1, limit: number) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = limit ? Number(limit) : Number(pageSize);

      const data = await this.replyModal
        .find({})
        .populate({
          path: 'tweet',
          populate: {
            path: 'target',
            populate: {
              path: 'profile',
            },
          },
        })
        .sort({ lastCrawl: 1 })
        .skip(skip)
        .limit(take);

      const totalItems = await this.replyModal.find({}).count();
      const totalPage = Math.ceil(totalItems / Number(pageSize));

      return {
        currentPage: Number(page),
        totalPage,
        itemsPerPage: Number(take),
        totalItems,
        data,
      };
    } catch (error) {
      throw error;
    }
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
