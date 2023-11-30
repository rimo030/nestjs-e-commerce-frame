import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRequiredOptionEntity } from '../product-required-option.entity';

export class CreateProductOptionsDto implements Partial<ProductRequiredOptionEntity> {
  @ApiProperty({ description: '옵션 이름' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '가격' })
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ description: '재고' })
  @IsNotEmpty()
  stock!: number;

  @ApiProperty({ description: '구매 가능 여부' })
  @IsNotEmpty()
  isSale!: number;
}
