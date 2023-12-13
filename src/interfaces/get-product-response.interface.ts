import { ProductEntity } from 'src/entities/product.entity';

export interface GetProductResponse {
  data: {
    list: ProductEntity[];
    totalPage: number;
  };

  meta: {
    page?: number | null;

    limit?: number | null;

    /**
     * 스크롤 기반에서 사용하기 위해서 마지막 상품 아이디를 제공한다.
     */
    lastProductId: number | null;

    search?: string | null;

    categoryId?: number | null;

    sellerId?: number | null;
  };
}
