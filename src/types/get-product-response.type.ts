import { ProductEntity } from 'src/entities/product.entity';

export type GetProductResponse = {
  data: {
    list: ProductEntity[];
  };

  meta: {
    page: number;

    totalPage: number;

    limit: number;

    /**
     * 스크롤 기반에서 사용하기 위해서 마지막 상품 아이디를 제공한다.
     */
    lastProductId: number;

    search?: string | null;

    categoryId?: number | null;

    sellerId?: number | null;
  };
};
