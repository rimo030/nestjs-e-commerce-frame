import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from '../../decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from '../../decorators/is-not-empty-string.decorator';
import { BuyerEntity } from '../buyer.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateBuyerDto
  extends AuthCredentialsDto
  implements Pick<BuyerEntity, 'name' | 'gender' | 'age' | 'phone'>
{
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
