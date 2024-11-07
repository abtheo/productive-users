import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  public users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: '$2a$10$3ZK/uYvIWcw5vV.Kf.jTfeDGsY.Hmu5INUkmACZf0d/AdCJ9ELCjK',
      role: Role.admin,
    },
  ];

  /**
   * Excludes the password field from a user object.
   * @param user User object
   * @returns A new user object without the password field
   */
  private excludePassword(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }

  /**
   * Creates a new user and saves it to the users list.
   * Hashes the provided password before saving the user.
   * @param createUserDto The DTO containing user details
   * @returns The created User object without the password.
   */
  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
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
    return this.excludePassword(newUser);
  }

  /**
   * Retrieves all users, excluding their passwords.
   * @returns A list of users without passwords
   */
  findAll(): Partial<User>[] {
    return this.users.map(this.excludePassword);
  }

  /**
   * Finds a user by their ID, excluding the password.
   * @param id The ID of the user
   * @returns The user object without the password
   * @throws NotFoundException if the user with the provided ID is not found
   */
  findById(id: number): Partial<User> {
    const user = this.users.find((user) => user.userId == id);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${JSON.stringify(this.users)} ${id} not found`,
      );
    }
    return this.excludePassword(user);
  }

  /**
   * Finds a user by their username, excluding the password.
   * @param username The username of the user
   * @returns The user object without the password
   * @throws NotFoundException if the user with the provided username is not found
   */
  findByUsername(username: string): Partial<User> {
    const user = this.users.find((user) => user.username === username);
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return this.excludePassword(user);
  }

  /**
   * Finds a user by their ID, including the password.
   * @param id The ID of the user
   * @returns The user object with the password
   * @throws NotFoundException if the user with the provided ID is not found
   */
  findByIdWithPassword(id: number): User {
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Finds a user by their username, including the password.
   * @param username The username of the user
   * @returns The user object with the password
   * @throws NotFoundException if the user with the provided username is not found
   */
  findByUsernameWithPassword(username: string): User {
    const user = this.users.find((user) => user.username === username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  /**
   * Updates an existing user's information.
   * @param id The ID of the user to update
   * @param updateUserDto The DTO containing updated user information
   * @returns The updated user object without a password
   * @throws NotFoundException if the user with the provided ID is not found
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return this.excludePassword(user);
  }

  /**
   * Removes a user by their ID.
   * @param id The ID of the user to remove
   * @throws NotFoundException if the user with the provided ID is not found
   */
  remove(id: number): void {
    const index = this.users.findIndex((user) => user.userId === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(index, 1);
  }

  /**
   * Increases the Role level of a User by one.
   * If the user is already the highest Role level,
   * no change occurs.
   * @param id User ID
   * @returns User object with updated Role.
   * @throws NotFoundException if a user with the provided `id` does not exist.
   */
  upgradeUser(id: number): Partial<User> {
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.role! < 2) {
      user.role!++;
    }
    return this.excludePassword(user);
  }

  /**
   * Decreases the Role level of a User by one.
   * If the user is already the lowest Role level,
   * no change occurs.
   * @param id User ID
   * @returns User object with updated Role.
   * @throws NotFoundException if a user with the provided `id` does not exist.
   */
  downgradeUser(id: number) {
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.role! > 0) {
      user.role!--;
    }
    return this.excludePassword(user);
  }
}
