import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaintsService } from './paints.service';
import { UpdatePaintDto } from './dto/update-paint.dto';
import { ListCreatePaintDto } from './dto/list-create-paint.dto';
import { ListDeletePaintDto } from './dto/list-delete-paint.dto';
import { ListUpdatePaintDto } from './dto/list-update-paint.dto';

@Controller('paints')
export class PaintsController {
  constructor(private readonly paintsService: PaintsService) {}

  @Post()
  create(@Body() listCreatePaintDto: ListCreatePaintDto) {
    return this.paintsService.create(listCreatePaintDto);
  }

  @Get()
  findAll() {
    return this.paintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paintsService.findOne(+id);
  }

  @Patch()
  update(@Body() listUpdatePaintDto: ListUpdatePaintDto) {
    return this.paintsService.update(listUpdatePaintDto);
  }

  @Delete()
  remove(@Body() listDeletePaintDto: ListDeletePaintDto) {
    return this.paintsService.remove(listDeletePaintDto);
  }
}
