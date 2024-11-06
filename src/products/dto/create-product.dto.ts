import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(Role)
  accessTier: Role;
}
