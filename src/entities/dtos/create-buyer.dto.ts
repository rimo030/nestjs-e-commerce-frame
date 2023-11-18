import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateBuyerDto extends AuthCredentialsDto {
  @ApiProperty({ description: '이름' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '성별' })
  @IsNotEmpty()
  gender!: number;

  @ApiProperty({ description: '나이' })
  @IsNotEmpty()
  age!: number;

  @ApiProperty({ description: '휴대전화번호 ( - 는 포함하지 않습니다 )' })
  @IsNotEmpty()
  phone!: string;
}
