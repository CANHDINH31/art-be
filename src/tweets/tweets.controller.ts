import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { AiTweetDto } from './dto/ai-tweet.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post('ai')
  ai(@Body() aiTweetDto: AiTweetDto) {
    return this.tweetsService.ai(aiTweetDto);
  }

  @Post('save')
  sync(@Body() body) {
    return this.tweetsService.sync(body);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createTweetDto) {
    return this.tweetsService.create(file, createTweetDto);
  }

  @Get('/auto-reply')
  autoReply() {
    return this.tweetsService.autoReply();
  }

  @Get('/check-error-reply')
  checkErrorReply(@Req() req) {
    const { status } = req.query;
    return this.tweetsService.checkErrorReply(status);
  }

  @Get('/export-csv')
  exportCsv(@Req() req) {
    const { pageSize, page, limit } = req.query;
    return this.tweetsService.exportCsv(pageSize, page, limit);
  }

  @Get()
  findAll(@Req() req) {
    const { pageSize, page, searchText, limit, status } = req.query;
    return this.tweetsService.findAll(
      pageSize,
      page,
      searchText,
      limit,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tweetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetsService.remove(+id);
  }
}
