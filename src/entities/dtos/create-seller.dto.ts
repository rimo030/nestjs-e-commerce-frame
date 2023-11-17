import { Optional } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateSellerDto extends AuthCredentialsDto {
  @Optional()
  name!: string;

  @Optional()
  age!: number;

  @Optional()
  phone!: string;

  @Optional()
  businessNumber!: string;
}
