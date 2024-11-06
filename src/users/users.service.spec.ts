import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/user.entity';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Mock bcrypt.hash to return a predictable value
    (bcrypt.hash as jest.Mock).mockImplementation((password) =>
      Promise.resolve(`hashed_${password}`),
    );
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.user,
      };

      const result = service.create(createUserDto);

      expect(result).toEqual({
        userId: expect.any(Number),
        username: 'testuser',
        password: expect.stringContaining('hashed_'),
        role: 'user',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', () => {
      const users = service.findAll();

      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user.password).toBeUndefined();
        expect(user.username).toBeDefined();
        expect(user.userId).toBeDefined();
        expect(user.role).toBeDefined();
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id without password', async () => {
      const user = service.findById(1);

      expect(user).toBeDefined();
      expect(user!.password).toBeUndefined();
      expect(user!.username).toBe('admin');
      expect(user!.userId).toBe(1);
    });

    it('should throw NotFoundException for non-existent user id', async () => {
      expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username without password', async () => {
      const user = service.findByUsername('admin');

      expect(user).toBeDefined();
      expect(user!.password).toBeUndefined();
      expect(user!.username).toBe('admin');
    });

    it('should throw NotFoundException for non-existent username', async () => {
      expect(service.findByUsername('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdWithPassword', () => {
    it('should return a user with password', async () => {
      const user = service.findByIdWithPassword(1);

      expect(user).toBeDefined();
      expect(user!.password).toBeDefined();
      expect(user!.username).toBe('admin');
    });
  });

  describe('findByUsernameWithPassword', () => {
    it('should return a user with password', async () => {
      const user = service.findByUsernameWithPassword('admin');

      expect(user).toBeDefined();
      expect(user!.password).toBeDefined();
      expect(user!.username).toBe('admin');
    });
  });

  describe('update', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updatedadmin',
        password: 'newpassword',
      };

      const result = await service.update(1, updateUserDto);

      expect(result.username).toBe('updatedadmin');
      expect(result.password).toContain('hashed_');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'test',
      };

      expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      const result = service.remove(1);
      expect(result).toBe('User #1 removed successfully');
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
