import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardPayload implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // return true or false for access:
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized!' });
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.JWTSECRET,
      });

      req.user = user;

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({ message: 'User is not authorized!' });
    }
  }
}
