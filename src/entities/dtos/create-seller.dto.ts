import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto extends AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  phone!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  businessNumber!: string;
}
