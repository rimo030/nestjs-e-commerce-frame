import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { feeStandard as chargeStandard } from 'src/types/enums/fee-standard.enum';
import { ProductBundleEntity } from '../product-bundle.entity';

export class CreateProductBundleDto implements Pick<ProductBundleEntity, 'name' | 'chargeStandard'> {
  @ApiProperty({ description: '묶음 배송 이름' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '묶음 배송 배송비 기준 값', type: 'enum', enum: chargeStandard })
  @IsEnum(chargeStandard)
  chargeStandard!: keyof typeof chargeStandard;
}
