import { Buyer } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';
import { IsOptionalString } from 'src/decorators/is-optional-string.decorator';
import { IsNotEmptyString } from '../decorators/is-not-empty-string.decorator';
import { AuthCredentialsRequestDto } from './auth-credentials.request.dto';

export class CreateBuyerRequestDto
  extends AuthCredentialsRequestDto
  implements Pick<Buyer, 'name' | 'gender' | 'age' | 'phone'>
{
  @ApiProperty({ type: String, description: '이름', required: true, example: 'myname' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ type: Number, description: '성별(남자 0, 여자 1)', required: true, example: 1 })
  @IsOptionalNumber('int', { min: 0, max: 1 })
  gender!: number | null;

  @ApiProperty({ type: Number, description: '나이', required: true, example: 20 })
  @IsOptionalNumber('int')
  age!: number | null;

  @ApiProperty({
    type: String,
    description: '휴대전화번호 ( - 는 포함하지 않습니다 )',
    required: true,
    example: '01012341234',
  })
  @Transform(({ value }) => value.replace(/-/g, ''))
  @IsOptionalString(11, 11)
  phone!: string | null;
}
