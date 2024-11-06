import { Role } from 'src/users/entities/user.entity';

export class Product {
  productId: number;
  name: string;
  price: number;
  accessTier: Role;
}
