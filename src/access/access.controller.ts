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
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  create(@Body() createAccessDto: CreateAccessDto) {
    return this.accessService.create(createAccessDto);
  }

  @Get()
  findAll(@Req() req) {
    const { visit } = req.query;
    return this.accessService.findAll(visit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
    return this.accessService.update(+id, updateAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessService.remove(+id);
  }
}
