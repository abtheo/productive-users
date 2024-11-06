import { Role } from 'src/users/entities/user.entity';

export class CreateProductDto {
  name: string;
  price: number;
  accessTier: Role;
}
