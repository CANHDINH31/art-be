import { Controller, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('change-password')
  changePassword(@Body() payload: { password: string }, @Req() req) {
    return this.usersService.changePassword(payload, req?.user?._id);
  }
}
