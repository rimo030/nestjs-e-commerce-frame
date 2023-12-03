/**
 * 상품 페이지 요청 Params
 * - page : 페이지 수
 * - limit : 읽어올 상품수
 * - category : 카테고리 id
 * - seller : 판매자 id
 */

export interface ProductParams {
  page: string;
  limit: string;
  category: string;
  seller: string;
}
