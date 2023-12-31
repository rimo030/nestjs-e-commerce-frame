import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { ProductListElement } from './product-list-element.interface';

export interface GetProductListResponse {
  data: {
    list: ProductListElement[];
    totalPage: number;
    /**
     * 스크롤 기반에서 사용하기 위해서 마지막 상품 아이디를 제공한다.
     */
    lastProductId: number | null;
  };

  meta: GetProductListPaginationDto;
}
