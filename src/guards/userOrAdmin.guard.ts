import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

/**
 * Guard that allows access to a resource if the authenticated user
 * is either the resource owner or has an 'admin' role.
 *
 * @class UserOrAdminGuard
 * @implements {CanActivate}
 */
@Injectable()
export class UserOrAdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = this.usersService.findById(request.user.userId); // Populated by AuthGuard
    const userIdParam = +request.params.id; // Get the `id` parameter from the request

    if (!user) {
      throw new ForbiddenException('No authenticated user found');
    }

    // Check if the user is accessing their own data or if they have an 'admin' role
    if (user.userId === userIdParam || user.role === Role.admin) {
      return true;
    }

    throw new ForbiddenException(`Access denied: insufficient permissions`);
  }
}
