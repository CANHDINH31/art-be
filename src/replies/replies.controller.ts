import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  create(@Body() createReplyDto: CreateReplyDto) {
    return this.repliesService.create(createReplyDto);
  }

  @Post('save')
  sync(@Body() body) {
    return this.repliesService.sync(body);
  }

  @Get()
  findAll(@Req() req) {
    const { pageSize, page, limit } = req.query;
    return this.repliesService.findAll(pageSize, page, limit);
  }

  @Get('/find-by-tweet/:id')
  findByTweet(@Param('id') id: string) {
    return this.repliesService.findByTweet(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repliesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReplyDto: UpdateReplyDto) {
    return this.repliesService.update(+id, updateReplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repliesService.remove(+id);
  }
}
