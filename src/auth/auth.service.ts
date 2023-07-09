import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto copy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async me(id: string) {
    try {
      const user = await this.userService.find({ id });
      const { password, ...data } = user.toObject();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const existUser = await this.userService.find({
        email: registerDto.email,
      });
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
  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.find({ email: signInDto.email });
      if (!user) {
        throw new UnauthorizedException({ message: 'Email không tồn tại' });
      }
      const isMatch = await bcrypt.compare(signInDto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException({
          message: 'Mật khẩu không chính xác',
        });
      }

      const { password, ...data } = user.toObject();
      const accessToken = await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('EXPIRESIN_TOKEN'),
      });
      const refreshToken = await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('EXPIRESIN_REFRESH'),
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async isRefreshTokenValid(exp: number) {
    try {
      const now = Date.now() / 1000;
      return now < exp;
    } catch (error) {
      return false;
    }
  }

  async refreshTokens(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const isRefreshTokenValid = await this.isRefreshTokenValid(payload.exp);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const accessTokenNew = await this.jwtService.signAsync(
      {
        _id: payload._id,
        name: payload.name,
        email: payload.email,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('EXPIRESIN_TOKEN'),
      },
    );

    const refreshTokenNew = await this.jwtService.signAsync(
      {
        _id: payload._id,
        name: payload.name,
        email: payload.email,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('EXPIRESIN_REFRESH'),
      },
    );

    return { access_token: accessTokenNew, refresh_token: refreshTokenNew };
  }
}
