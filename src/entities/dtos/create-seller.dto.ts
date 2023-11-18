import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateSellerDto extends AuthCredentialsDto {
  @ApiProperty({ description: '이름' })
  @Optional()
  name!: string;

  @ApiProperty({ description: '대표번호' })
  @Optional()
  phone!: string;

  @ApiProperty({ description: '사업자등록번호' })
  @Optional()
  businessNumber!: string;
}
