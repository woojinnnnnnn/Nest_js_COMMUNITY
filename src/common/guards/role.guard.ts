import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User, UserStatus } from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserStatus[]>('role', context.getHandler());

    if (!roles) { // roles가 없으면 true를 리턴하고 진행한다.
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user && roles.includes(user.role);
  }
}
