import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateBuyerDto extends AuthCredentialsDto {
  @ApiProperty({ description: '이름' })
  @Optional()
  name!: string;

  @ApiProperty({ description: '성별' })
  @Optional()
  gender!: number;

  @ApiProperty({ description: '나이' })
  @Optional()
  age!: number;

  @ApiProperty({ description: '휴대전화번호' })
  @Optional()
  phone!: string;
}
