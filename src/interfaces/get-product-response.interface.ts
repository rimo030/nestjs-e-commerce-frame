import { GetProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';

export interface GetProductResponse {
  data: {
    list: ProductEntity[];
    totalPage: number;
    /**
     * 스크롤 기반에서 사용하기 위해서 마지막 상품 아이디를 제공한다.
     */
    lastProductId: number | null;
  };

  meta: GetProductPaginationDto;
}
