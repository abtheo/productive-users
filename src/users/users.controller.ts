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

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('profile')
  @Roles('user', 'super-user', 'admin') // Accessible to all roles
  getProfile() {
    return 'This is the user profile';
  }

  @Get('admin')
  @Roles('admin') // Only accessible to 'admin' role
  getAdminContent() {
    return 'This is admin content';
  }

  @Get('super-user')
  @Roles('super-user', 'admin') // Accessible to 'super-user' and 'admin'
  getSuperuserContent() {
    return 'This is super-user content';
  }
}
