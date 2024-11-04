import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AuthService, UsersService],
})
export class ProductsModule {}
