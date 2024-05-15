import { ProductBundle } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { chargeStandard } from 'src/types/charge-standard.type';

export class CreateProductBundleDto implements Pick<ProductBundle, 'name' | 'chargeStandard'> {
  @ApiProperty({ type: String, description: '묶음 배송 이름', required: true, example: 'Test Bundle name' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({
    type: 'enum',
    enum: ['MIN', 'MAX'],
    description: '묶음 배송 배송비 기준 값 ("MIN", "MAX" 허용)',
    required: true,
    example: 'MIN',
  })
  @IsEnum(['MIN', 'MAX'])
  chargeStandard!: chargeStandard;
}
