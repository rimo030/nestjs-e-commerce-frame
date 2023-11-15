import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  bundleId!: number;

  @IsNotEmpty()
  categoryId!: number;

  @IsNotEmpty()
  companyId!: number;

  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  price!: number;

  @IsOptional()
  description!: string;

  @IsNotEmpty()
  shippingFee!: number;
}
