import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/users/role.guard';
import { Roles } from 'src/users/roles.decorator';
import { UserOrAdminGuard } from 'src/auth/userOrAdmin.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserOrAdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(UserOrAdminGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('home')
  getProfile() {
    return 'This is the home page';
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAdminContent() {
    return 'This is admin content';
  }

  @Get('super-user')
  @UseGuards(RolesGuard)
  @Roles('super-user', 'admin')
  getSuperuserContent() {
    return 'This is super-user+ content';
  }
}
