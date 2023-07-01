import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async create(registerDto: RegisterDto) {
    try {
      const existUser = await this.userService.find(registerDto.email);
      if (!existUser) {
        const password = await bcrypt.hash(registerDto.password, 10);
        await this.userService.create({ ...registerDto, password });
        return {
          status: HttpStatus.CREATED,
          message: 'Đăng kí tài khoản thành công',
        };
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Email đã tồn tại',
      };
    } catch (error) {
      throw error;
    }
  }
}
