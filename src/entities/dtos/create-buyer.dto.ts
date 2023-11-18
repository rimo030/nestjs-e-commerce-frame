import { Optional } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { ApiProperty } from '@nestjs/swagger';

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
