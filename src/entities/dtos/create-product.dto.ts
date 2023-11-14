import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
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

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  shippingFee!: number;
}
