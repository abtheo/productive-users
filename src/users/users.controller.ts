import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, Roles, RolesGuard, UserOrAdminGuard } from '../guards';
import { Role } from '../users/entities/user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
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
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(UserOrAdminGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('upgrade/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  upgradeUser(@Param('id') id: string) {
    return this.usersService.upgradeUser(+id);
  }

  @Patch('downgrade/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  downgradeUser(@Param('id') id: string) {
    return this.usersService.downgradeUser(+id);
  }
}
