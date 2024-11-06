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
import { AuthGuard, Roles, RolesGuard, UserOrAdminGuard } from '../guards';
import { Role } from 'src/users/entities/user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(UserOrAdminGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
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
  @Roles(Role.admin)
  getAdminContent() {
    return 'This is admin content';
  }

  @Get('superUser')
  @UseGuards(RolesGuard)
  @Roles(Role.superUser)
  getSuperuserContent() {
    return 'This is superUser+ content';
  }

  @Patch(':id')
  @UseGuards(UserOrAdminGuard)
  upgradeUser(@Param('id') id: string) {
    return this.usersService.upgradeUser(+id);
  }
}
