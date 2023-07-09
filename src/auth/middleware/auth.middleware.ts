import {
  Injectable,
  NestMiddleware,
  Next,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async use(@Req() req, @Res() res, @Next() next) {
    const token = req.headers?.authorization;
    if (token) {
      try {
        const decoded = await this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        req.user = decoded;
        next();
      } catch (err) {
        throw err;
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
