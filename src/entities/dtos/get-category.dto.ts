import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class GetCategoryDto extends PickType(CategoryEntity, ['id', 'name']) {}
