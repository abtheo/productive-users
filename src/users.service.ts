
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export type User = {
    userId: number,
    username: string,
    password: string
}

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(username: string, password: string): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const user = new this.userModel({
      username,
      password: hashedPassword,
    });
  
    return user.save();
  }
}
