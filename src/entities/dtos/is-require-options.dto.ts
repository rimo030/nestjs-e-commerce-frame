import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IsRequireOptionDto {
  @ApiProperty({ description: '필수옵션 여부' })
  @IsNotEmpty()
  @IsBoolean()
  isRequire!: boolean;
}
