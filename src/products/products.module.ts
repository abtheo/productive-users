import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AuthService, UsersService, JwtService],
  imports: [AuthModule],
})
export class ProductsModule {}
