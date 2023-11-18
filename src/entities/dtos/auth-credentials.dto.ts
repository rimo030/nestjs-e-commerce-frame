import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '비밀번호는 문자, 숫자, 특수문자의 조합으로 8자이상 20자이하로 입력해주세요. ',
  })
  password!: string;
}
