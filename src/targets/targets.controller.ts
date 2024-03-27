import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TargetsService } from './targets.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Post()
  create(@Body() createTargetDto: CreateTargetDto) {
    return this.targetsService.create(createTargetDto);
  }

  @Get()
  findAll() {
    return this.targetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.targetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTargetDto: UpdateTargetDto) {
    return this.targetsService.update(+id, updateTargetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.targetsService.remove(+id);
  }
}
