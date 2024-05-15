import { ProductOption } from '@prisma/client';

export interface ProductOptionDto extends Pick<ProductOption, 'id' | 'productId' | 'name' | 'price' | 'isSale'> {}
