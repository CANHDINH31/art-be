import { UpdateCommentDto } from './dto/update-comment.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemas/comments.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModal: Model<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    try {
      const createdRate = await this.commentModal.create({
        ...createCommentDto,
        user_id: userId,
      });
      return createdRate;
    } catch (error) {
      throw error;
    }
  }

  async findManyByPaintId(paintId: string) {
    try {
      const foundComment = await this.commentModal
        .find({
          paint_id: paintId,
        })
        .populate('user_id paint_id')
        .sort({ updatedAt: -1 });
      return foundComment;
    } catch (error) {
      throw error;
    }
  }

  async update(updateCommentDto: UpdateCommentDto, id: string) {
    try {
      return await this.commentModal.findByIdAndUpdate(
        id,
        {
          content: updateCommentDto.content,
        },
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.commentModal.findByIdAndDelete(id);
      return 'Delete paint successfully';
    } catch (error) {
      throw error;
    }
  }
}
