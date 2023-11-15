import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateSellerDto extends AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  businessNumber!: string;
}
