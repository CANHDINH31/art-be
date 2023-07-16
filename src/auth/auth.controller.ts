import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto copy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@Req() req) {
    return this.authService.me(req.user._id);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('google')
  async loginGoogle(@Body() { token }: { token: string }) {
    return await this.authService.verifyToken(token, 'GOOGLE');
  }

  @Post('refresh')
  async refresh(@Body() body) {
    const { refreshToken } = body;
    return await this.authService.refreshTokens(refreshToken);
  }
}
