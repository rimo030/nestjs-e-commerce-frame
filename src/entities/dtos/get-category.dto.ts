import { Category } from '@prisma/client';

export interface GetCategoryDto extends Pick<Category, 'id' | 'name'> {}
