import { IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';

export class AuthCredentialsDto {
  @ApiProperty({ type: String, description: '이메일', required: true, example: 'myemail@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    description: '비밀번호 (문자, 숫자, 특수문자(@, $, !, %, *, ?, &, .)의 조합으로 6자 이상 20자 이하로 입력해주세요)',
    required: true,
    example: 'mypassword1!',
  })
  @IsNotEmptyString(6, 20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/, {
    message: '비밀번호는 문자, 숫자, 특수문자(@, $, !, %, *, ?, &, .)의 조합으로 6자 이상 20자 이하로 입력해주세요 ',
  })
  password!: string;
}
