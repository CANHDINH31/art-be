import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListDeleteUserDto } from './dto/list-delete-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-by-admin')
  @UseInterceptors(FileInterceptor('file'))
  createByAdmin(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.usersService.createByAdmin(file, body.data);
  }

  @Patch('/update-by-admin/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateByAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Param('id') id: string,
  ) {
    return this.usersService.updateByAdmin(file, body.data, id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/favourite/:id')
  list(@Param('id') id: string, @Req() req) {
    return this.usersService.favourite(id, req?.user?._id);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  index(@Req() req) {
    const { pageSize, page, searchText, limit, provider, role } = req.query;
    return this.usersService.list(
      page,
      pageSize,
      searchText,
      limit,
      provider,
      role,
    );
  }

  @Post('change-password')
  changePassword(@Body() payload: { password: string }, @Req() req) {
    return this.usersService.changePassword(payload, req?.user?._id);
  }

  @Post('delete')
  remove(@Body() listDeleteUserDto: ListDeleteUserDto) {
    return this.usersService.remove(listDeleteUserDto);
  }
}
