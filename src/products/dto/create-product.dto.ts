import { Role } from 'src/users/entities/user.entity';

export class CreateProductDto {
  productId: number;
  name: string;
  price: number;
  accessTier: Role;
}
