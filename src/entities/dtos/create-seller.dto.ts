import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateSellerDto extends AuthCredentialsDto {
  @ApiProperty({ description: '이름' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '대표번호 ( - 는 포함하지 않습니다 )' })
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ description: '사업자등록번호' })
  @IsNotEmpty()
  businessNumber!: string;
}
