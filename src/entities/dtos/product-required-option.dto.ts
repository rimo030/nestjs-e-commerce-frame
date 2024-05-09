import { ProductRequiredOption } from '@prisma/client';

export interface ProductRequiredOptionDto
  extends Pick<ProductRequiredOption, 'id' | 'productId' | 'name' | 'price' | 'isSale'> {}
