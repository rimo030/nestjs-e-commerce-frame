import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyBoolean } from 'src/decorators/is-not-empty-boolean.decorator';

export class IsRequireOptionDto {
  @ApiProperty({ type: Boolean, description: '필수옵션 여부', required: true })
  @IsNotEmptyBoolean()
  isRequire!: boolean;
}
