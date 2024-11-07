import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
  imports: [AuthModule, UsersModule],
  exports: [ProductsService],
})
export class ProductsModule {}
