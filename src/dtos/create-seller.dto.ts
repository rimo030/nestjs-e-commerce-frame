import { Seller } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../decorators/is-not-empty-string.decorator';
import { AuthCredentialsRequestDto } from './auth-credentials.request.dto';

export class CreateSellerDto
  extends AuthCredentialsRequestDto
  implements Pick<Seller, 'name' | 'phone' | 'businessNumber'>
{
  @ApiProperty({ type: String, description: '이름', required: true, example: 'myname' })
  @IsNotEmptyString(1, 32)
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
