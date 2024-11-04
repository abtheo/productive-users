import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findById(request.user.id);

    if (!request.user || !user || !user.role) {
      throw new ForbiddenException(`User not authenticated or does not exist.`);
    }

    // Check if the user's role is included in the required roles
    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true; // User exists, is authed and has the required role: allow access
  }
}
