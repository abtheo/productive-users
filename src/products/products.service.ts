import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Role } from '../users/entities/user.entity'; // Assuming Role is imported from user entity

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      productId: 1,
      name: 'Basic Package',
      price: 9.99,
      accessTier: 'user',
    },
    {
      productId: 2,
      name: 'Premium Package',
      price: 19.99,
      accessTier: 'super-user',
    },
  ];

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      productId: this.products.length + 1,
      name: createProductDto.name,
      price: createProductDto.price,
      accessTier: createProductDto.accessTier,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findById(id: number): Product | undefined {
    return this.products.find((product) => product.productId === id);
  }

  findByAccessTier(accessTier: Role): Product[] {
    return this.products.filter((product) => product.accessTier === accessTier);
  }

  /**
   * Updates a product with a given ID.
   * @param id - The unique identifier of the product to find.
   * @returns The updated Product.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (updateProductDto.name !== undefined) {
      // Update only the fields that are provided
      product.name = updateProductDto.name;
    }
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }
    if (updateProductDto.accessTier !== undefined) {
      product.accessTier = updateProductDto.accessTier;
    }

    return product;
  }

  remove(id: number): string {
    const index = this.products.findIndex(
      (product) => product.productId === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products.splice(index, 1);
    return `Product #${id} removed successfully`;
  }
}
