import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, AuthService, UsersService, JwtService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a new product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 14.99,
        accessTier: Role.user,
      };

      const result = service.create(createProductDto);

      expect(result).toEqual({
        productId: expect.any(Number),
        name: 'Test Product',
        price: 14.99,
        accessTier: Role.user,
      });
    });
  });

  describe('findAll', () => {
    it('should return all products', () => {
      const products = service.findAll();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('findById', () => {
    it('should return a product by id', () => {
      const product = service.findById(1);
      expect(product).toBeDefined();
      expect(product?.name).toBe('Basic Package');
      expect(product?.accessTier).toBe(Role.user);
    });

    it('should return undefined for non-existent product id', () => {
      const product = service.findById(999);
      expect(product).toBeUndefined();
    });
  });

  describe('findByAccessTier', () => {
    it('should return products by access tier', () => {
      const products = service.findByAccessTier(Role.user);
      expect(products.length).toBeGreaterThan(0);
      products.forEach((product) => {
        expect(product.accessTier).toBeGreaterThanOrEqual(Role.user);
      });
    });

    it('should return empty array for non-existent access tier', () => {
      const products = service.findByAccessTier(
        'nonexistent' as unknown as Role,
      );
      expect(products).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a product', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 24.99,
        accessTier: Role.superUser,
      };

      const result = service.update(1, updateProductDto);

      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(24.99);
      expect(result.accessTier).toBe(Role.superUser);
    });

    it('should throw NotFoundException for non-existent product', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Test',
      };

      expect(() => service.update(999, updateProductDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', () => {
      const result = service.remove(1);
      expect(result).toBe('Product #1 removed successfully');
    });

    it('should throw NotFoundException for non-existent product', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
