import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Always run the JWT strategy so `req.user` is populated whenever a valid
    // Bearer token is present — even on @Public() routes (e.g. recommendations,
    // which personalize results when the caller is logged in). Whether a
    // missing/invalid token is fatal is decided in handleRequest() below.
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public routes: authentication is optional. Attach the user when a valid
    // token was supplied, otherwise let the request through with no user.
    if (isPublic) {
      return (user ?? undefined) as TUser;
    }

    // Protected routes: a valid authenticated user is required.
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user as TUser;
  }
}
