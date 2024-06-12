import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Put,
} from '@nestjs/common';
import { PaintsService } from './paints.service';
import { ListCreatePaintDto } from './dto/list-create-paint.dto';
import { ListDeletePaintDto } from './dto/list-delete-paint.dto';
import { ListUpdatePaintDto } from './dto/list-update-paint.dto';
import { UpdateDetailPaintDto } from './dto/update-detail-paint.dto';

@Controller('paints')
export class PaintsController {
  constructor(private readonly paintsService: PaintsService) {}

  @Post()
  create(@Body() listCreatePaintDto: ListCreatePaintDto) {
    return this.paintsService.create(listCreatePaintDto);
  }

  @Get()
  index(@Req() req) {
    const { pageSize, page, title, limit } = req.query;
    return this.paintsService.list(page, pageSize, title, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paintsService.findOne(id);
  }

  @Put(':id')
  views(@Param('id') id: string) {
    return this.paintsService.views(id);
  }

  @Patch('/update/:id')
  updatePaint(
    @Param('id') id: string,
    @Body() updateDetailPaintDto: UpdateDetailPaintDto,
  ) {
    return this.paintsService.updatePaint(id, updateDetailPaintDto);
  }

  @Patch()
  update(@Body() listUpdatePaintDto: ListUpdatePaintDto) {
    return this.paintsService.update(listUpdatePaintDto);
  }

  @Post('delete')
  remove(@Body() listDeletePaintDto: ListDeletePaintDto) {
    return this.paintsService.remove(listDeletePaintDto);
  }
}
