import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  description!: string;
}
