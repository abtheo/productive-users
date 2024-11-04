import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Ensure AuthGuard is populating `request.user`

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    // Check if the user's role is included in the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true; // User has the required role, allow access
  }
}
