import { v4 } from 'uuid';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { test_seller_sign_in } from '../auth/test_seller_sign_in';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';

/**
 * 판매자가 직접 상품을 생성하는 상황을 가정한다.
 * 리턴되는 상품은 Mock data로, 아무런 의미도 가지고 있지 않다.
 * e2e 테스트를 위해 `fetch` 함수로 직접 테스트를 한다.
 *
 * @todo 추후 더 세밀한 테스트를 위해 option을 통해 상품을 세밀하게 수정할 수 있도록 한다.
 *
 * endpoint는 `POST seller/product` 에 해당한다.
 *
 * @param options 상품을 생성하기 위해 필요한 정보들
 * @returns
 */
export async function test_seller_create_product(options: {
  bundleId: number;
  categoryId: number;
  companyId: number;
}): Promise<ReturnType<SellerController['createProduct']>> {
  const { bundleId, categoryId, companyId } = options;
  const sellerId = await test_seller_sign_up();
  const signInResponse = await test_seller_sign_in();

  const response = await fetch('http://localhost/3000/seller/product', {
    headers: {
      authorization: `bearer ${signInResponse.data.accessToken}`,
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      bundleId: bundleId,
      categoryId: categoryId,
      companyId: companyId,
      isSale: true,
      name: v4().slice(0, 10),
      description: v4().slice(0, 10),
      deliveryType: 'FREE',
      deliveryFreeOver: null,
      deliveryCharge: 0,
      img: v4().slice(0, 10),
    } satisfies CreateProductDto),
  });

  const data: Awaited<ReturnType<SellerController['createProduct']>> = await response.json();
  return data;
}
