import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';

export class CreateCategoryDto implements Pick<Category, 'name'> {
  @ApiProperty({ type: String, description: '이름', uniqueItems: true, required: true, example: 'mycategory' })
  @IsNotEmptyString(1, 128)
  name!: string;
}
