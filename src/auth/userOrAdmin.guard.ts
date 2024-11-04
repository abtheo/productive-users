import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserOrAdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by AuthGuard
    const userIdParam = +request.params.id; // Get the `id` parameter from the request

    if (!user) {
      throw new ForbiddenException('No authenticated user found');
    }

    // Check if the user is accessing their own data or if they have an 'admin' role
    if (user.userId === userIdParam || user.role === 'admin') {
      return true;
    }

    throw new ForbiddenException('Access denied: insufficient permissions');
  }
}
