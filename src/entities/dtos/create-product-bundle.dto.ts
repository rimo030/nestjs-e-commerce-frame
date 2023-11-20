import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { feeStandard } from 'src/types/enums/fee-standard.enum';

export class CreateProductBundleDto {
  @ApiProperty({ description: 'seller id' })
  @IsNotEmpty()
  sellerId!: number;

  @ApiProperty({ description: '묶음 배송 이름' })
  @IsNotEmpty()
  bundleName!: string;

  @ApiProperty({ description: '묶음 배송 배송비 기준 값', type: 'enum', enum: feeStandard })
  @IsEnum(feeStandard)
  feeStandard!: keyof typeof feeStandard;
}
