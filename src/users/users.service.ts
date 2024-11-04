import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

export function excludePassword(user: User): Partial<User> {
  const { password, ...result } = user;
  return result;
}
@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: '$2a$10$3ZK/uYvIWcw5vV.Kf.jTfeDGsY.Hmu5INUkmACZf0d/AdCJ9ELCjK',
      role: 'admin',
    },
  ];
  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const newUser: User = {
      userId: this.users.length + 1,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): Partial<User>[] {
    return this.users.map(excludePassword);
  }

  async findById(id: number): Promise<Partial<User> | undefined> {
    const user = this.users.find((user) => user.userId === id);
    return user ? excludePassword(user) : undefined;
  }

  async findByUsername(username: string): Promise<Partial<User> | undefined> {
    const user = this.users.find((user) => user.username === username);
    return user ? excludePassword(user) : undefined;
  }

  async findByIdWithPassword(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === id);
  }

  async findByUsernameWithPassword(
    username: string,
  ): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.users.find((user) => user.userId === id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return user;
  }

  remove(id: number): string {
    const index = this.users.findIndex((user) => user.userId === id);
    if (index === -1)
      throw new NotFoundException(`User with ID ${id} not found`);

    this.users.splice(index, 1);
    return `User #${id} removed successfully`;
  }
}
