import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '비밀번호 조건에 맞지 않음',
  })
  hashedPassword!: string;
}
