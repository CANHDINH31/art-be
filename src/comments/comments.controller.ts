import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(createCommentDto, req?.user?._id);
  }

  @Get('/find-many-by-paint-id/:id')
  findManyByPaintId(@Param('id') id: string) {
    return this.commentsService.findManyByPaintId(id);
  }

  @Put('/:id')
  update(@Body() updateCommentDto: UpdateCommentDto, @Param('id') id: string) {
    return this.commentsService.update(updateCommentDto, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
