import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

/**
 * Guard that allows access to a resource if the authenticated user
 * has a role matching the specified role list.
 *
 * Set the minimum Role access level using the `@Roles` guard, e.g.
 * ```typescript
    \@UseGuards(RolesGuard)
    \@Role('admin')
  ```
 * @class UserOrAdminGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<Role>('role', context.getHandler());
    if (!requiredRole) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findById(request.user.id);

    if (!request.user || !user || !user.role) {
      throw new ForbiddenException(`User not authenticated or does not exist.`);
    }

    // Check if the user's role equal to or greater than required role level
    if (user?.role >= requiredRole) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true; // User exists, is authed and has the required role: allow access
  }
}
