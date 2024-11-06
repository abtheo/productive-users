import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
