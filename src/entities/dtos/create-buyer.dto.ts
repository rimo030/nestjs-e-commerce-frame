import { Optional } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateUserDto extends AuthCredentialsDto {
  @Optional()
  name!: string;

  @Optional()
  gender!: number;

  @Optional()
  age!: number;

  @Optional()
  phone!: string;
}
