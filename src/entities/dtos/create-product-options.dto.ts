import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyBoolean } from 'src/decorators/is-not-empty-boolean.decorator';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { ProductRequiredOptionEntity } from '../product-required-option.entity';

export class CreateProductOptionsDto implements Pick<ProductRequiredOptionEntity, 'name' | 'price' | 'isSale'> {
  @ApiProperty({ type: String, description: '옵션 이름', required: true })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ type: Number, description: '가격', required: true })
  @IsNotEmptyNumber()
  price!: number;

  @ApiProperty({ type: Boolean, description: '구매 가능 여부', required: true })
  @IsNotEmptyBoolean()
  isSale!: boolean;
}
