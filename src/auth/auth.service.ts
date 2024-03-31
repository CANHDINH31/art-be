import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto copy';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectQueue('forgot-password') private sendMail: Queue,
  ) {}
  async me(id: string) {
    try {
      const user = await this.userService.find({ _id: id });
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
        provider: 'WEB',
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
      const user = await this.userService.find({
        email: signInDto.email,
        provider: 'WEB',
      });
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
      return { accessToken, refreshToken, user: data };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.sendMail.empty();
      const user = await this.userService.find({ email, provider: 'WEB' });
      if (!user)
        throw new BadRequestException({
          message: 'Email không tồn tại',
        });
      const { password, ...data } = user.toObject();
      const token = await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '5m',
      });
      await this.sendMail.add({ email: data.email, token });
      return {
        status: HttpStatus.OK,
        data: { email: data.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(payload: { token: string; password: string }) {
    try {
      const decode = await this.jwtService.verify(payload.token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const password = await bcrypt.hash(payload.password, 10);
      await this.userService.update({ _id: decode._id, password });
      return {
        status: HttpStatus.OK,
        message: 'Cập nhật mật khẩu thành công',
      };
    } catch (error) {
      throw new BadRequestException('Hết thời gian thay đổi mật khẩu');
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

    return { accessToken: accessTokenNew, refreshToken: refreshTokenNew };
  }

  async verifyToken(token: string, method: string) {
    try {
      const url =
        method === 'GOOGLE'
          ? this.configService.get('GOOGLE_VERIFY_TOKEN') + token
          : this.configService.get('FACEBOOK_VERIFY_TOKEN') + token;
      const res = await this.httpService.axiosRef.get(url);
      if (res.data) {
        const user = await this.userService.find({
          email: res.data.email,
          provider: method,
        });
        if (user) {
          const payload = {
            _id: user._id.toString(),
            name: res.data.name,
            image: res.data?.picture?.data?.url || res.data.picture,
          };
          const updatedUser = await this.userService.update(payload);
          const accessToken = await this.jwtService.signAsync(
            updatedUser.toObject(),
            {
              secret: this.configService.get('JWT_SECRET'),
              expiresIn: this.configService.get('EXPIRESIN_TOKEN'),
            },
          );
          const refreshToken = await this.jwtService.signAsync(
            updatedUser.toObject(),
            {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
              expiresIn: this.configService.get('EXPIRESIN_REFRESH'),
            },
          );

          return {
            accessToken,
            refreshToken,
            user: updatedUser,
          };
        }
        if (!user) {
          const createdUser = await this.userService.create({
            email: res.data.email,
            name: res.data.name,
            provider: method,
            image: res.data?.picture?.data?.url || res.data?.picture,
          });

          const accessToken = await this.jwtService.signAsync(
            createdUser.toObject(),
            {
              secret: this.configService.get('JWT_SECRET'),
              expiresIn: this.configService.get('EXPIRESIN_TOKEN'),
            },
          );
          const refreshToken = await this.jwtService.signAsync(
            createdUser.toObject(),
            {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
              expiresIn: this.configService.get('EXPIRESIN_REFRESH'),
            },
          );
          return {
            accessToken,
            refreshToken,
            user: createdUser,
          };
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
