import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { SyncRateDto } from './dto/sync-rate.dto';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  sync(@Body() syncRateDto: SyncRateDto, @Req() req) {
    return this.rateService.sync(syncRateDto, req?.user?._id);
  }

  @Get('/find-one-by-id/:id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.rateService.findOne({ paint_id: id, user_id: req?.user?._id });
  }

  @Get('/find-many-by-id/:id')
  findMany(@Param('id') id: string) {
    return this.rateService.findMany(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.rateService.delete(id);
  }
}
