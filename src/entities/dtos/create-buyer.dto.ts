import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { BuyerEntity } from '../buyer.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateBuyerDto
  extends AuthCredentialsDto
  implements Pick<BuyerEntity, 'name' | 'gender' | 'age' | 'phone'>
{
  @ApiProperty({ type: String, description: '이름', required: true })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ type: Number, description: '성별', required: true })
  @IsNotEmptyNumber()
  gender!: number;

  @ApiProperty({ type: Number, description: '나이', required: true })
  @IsNotEmptyNumber()
  age!: number;

  @ApiProperty({ type: String, description: '휴대전화번호 ( - 는 포함하지 않습니다 )', required: true })
  @Transform(({ value }) => value.replace(/-/g, ''))
  @IsNotEmptyString(11, 11)
  phone!: string;
}
