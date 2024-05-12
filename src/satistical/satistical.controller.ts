import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SatisticalService } from './satistical.service';
import { CreateSatisticalDto } from './dto/create-satistical.dto';
import { UpdateSatisticalDto } from './dto/update-satistical.dto';

@Controller('satistical')
export class SatisticalController {
  constructor(private readonly satisticalService: SatisticalService) {}

  @Post()
  create(@Body() createSatisticalDto: CreateSatisticalDto) {
    return this.satisticalService.create(createSatisticalDto);
  }

  @Get('/basic')
  basic() {
    return this.satisticalService.basic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.satisticalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSatisticalDto: UpdateSatisticalDto,
  ) {
    return this.satisticalService.update(+id, updateSatisticalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.satisticalService.remove(+id);
  }
}
