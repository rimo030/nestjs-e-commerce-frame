import { ApiProperty } from '@nestjs/swagger';
import { SellerEntity } from 'src/entities/seller.entity';
import { IsNotEmptyString } from 'src/util/decorator/validate.decorater';
import { AuthCommonDto } from './auth.common.dto';

export class CreateSellerDto extends AuthCommonDto implements Pick<SellerEntity, 'name' | 'phone' | 'businessNumber'> {
  @ApiProperty({ type: String, description: '이름', required: true, example: 'myname' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({
    type: String,
    description: '대표번호 ( - 는 포함하지 않습니다 )',
    required: true,
    example: '01012341234',
  })
  @IsNotEmptyString(11, 11)
  phone!: string;

  @ApiProperty({ type: String, description: '사업자등록번호', required: true, example: '12341234' })
  @IsNotEmptyString(1, 128)
  businessNumber!: string;
}
