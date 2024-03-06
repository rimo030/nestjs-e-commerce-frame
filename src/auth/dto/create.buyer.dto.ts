import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BuyerEntity } from 'src/entities/buyer.entity';
import { IsNotEmptyString, IsNotEmptyNumber } from 'src/util/decorator/validate.decorater';
import { AuthCommonDto } from './auth.common.dto';

export class CreateBuyerDto extends AuthCommonDto implements Pick<BuyerEntity, 'name' | 'gender' | 'age' | 'phone'> {
  @ApiProperty({ type: String, description: '이름', required: true, example: 'myname' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ type: Number, description: '성별(남자 0, 여자 1)', required: true, example: 1 })
  @IsNotEmptyNumber()
  gender!: number;

  @ApiProperty({ type: Number, description: '나이', required: true, example: 20 })
  @IsNotEmptyNumber()
  age!: number;

  @ApiProperty({
    type: String,
    description: '휴대전화번호 ( - 는 포함하지 않습니다 )',
    required: true,
    example: '01012341234',
  })
  @Transform(({ value }) => value.replace(/-/g, ''))
  @IsNotEmptyString(11, 11)
  phone!: string;
}
