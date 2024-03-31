import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SyncProfileDto } from './dto/sync-profile.dto';
import { UpdateByCrawlProfileDto } from './dto/update-by-crawl-profile.dto';
import { UpdateByUsernameDto } from './dto/update-by-username-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put('/update-by-username')
  updateByUSername(@Body() updateByUsernameDto: UpdateByUsernameDto) {
    return this.profilesService.updateByUSername(updateByUsernameDto);
  }

  @Post()
  sync(@Body() syncProfileDto: SyncProfileDto) {
    return this.profilesService.sync(syncProfileDto);
  }

  @Get('/list-username')
  getListUsername() {
    return this.profilesService.getListUsername();
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch('/update-by-crawl')
  updateByCrawl(@Body() updateByCrawlProfileDto: UpdateByCrawlProfileDto) {
    return this.profilesService.updateByCrawl(updateByCrawlProfileDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
