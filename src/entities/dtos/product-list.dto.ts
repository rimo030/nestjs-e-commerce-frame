import { DeliveryType } from '@prisma/client';
import { ProductDto } from './product.dto';

export class ProductListDto {
  id: number;
  sellerId: number;
  categoryId: number;
  companyId: number;
  name: string;
  deliveryType: DeliveryType;
  img: string;
  salePrice!: number;

  /**
   * 상품에 대한 썸네일을 의미한다.
   * thumbnail: string;
   */

  /**
   * 상품에 대한 리뷰 별점을 의미한다.
   * rating : number;
   *
   * 상품에 대한 리뷰 작성수를 의미한다.
   * reviewCount : number;
   */
  constructor(product: ProductDto, salePrice: number) {
    this.id = product.id;
    this.sellerId = product.sellerId;
    this.categoryId = product.categoryId;
    this.companyId = product.companyId;
    this.name = product.name;
    this.deliveryType = product.deliveryType;
    this.img = product.img;
    this.salePrice = salePrice;
  }
}
