import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { feeStandard as chargeStandard } from 'src/types/enums/fee-standard.enum';

export class CreateProductBundleDto implements Pick<ProductBundleEntity, 'name' | 'chargeStandard'> {
  @ApiProperty({ type: String, description: '묶음 배송 이름', required: true, example: 'Test Bundle name' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({
    type: 'enum',
    enum: chargeStandard,
    description: '묶음 배송 배송비 기준 값 ("MIN", "MAX" 허용)',
    required: true,
    example: 'MIN',
  })
  @IsEnum(chargeStandard)
  chargeStandard!: keyof typeof chargeStandard;
}
