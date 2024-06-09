import axios from 'axios';
import { v4 } from 'uuid';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';
import { test_create_product_bundle } from './test_seller_create_product_bundle';

/**
 * 상품 묶음 수정을 테스트 합니다.
 * 엔드포인트는 `Patch seller/product-bundle/:id` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param accessToken 인증에 사용할 판매자 토큰입니다. 주어지지 않을 경우 임의의 seller를 등록한 뒤 상품 묶음을 합니다.
 * @param id 수정할 상품 묶음의 아이디 입니다. 주어지지 않을 경우 임의의 상품 묶음을 생성한 뒤 수정합니다.
 * @param option 수정할 상품 묶음의 데이터 입니다.
 */
export async function test_update_product_bundle(
  PORT: number,
  accessToken?: string,
  id?: number,
  option?: Partial<CreateProductBundleDto>,
): Promise<ReturnType<SellerController['updateProductBundle']>> {
  if (!accessToken) {
    const signUpResponse = await test_seller_sign_up(PORT);
    accessToken = signUpResponse.data.accessToken;
  }

  if (!id) {
    const productBundle = await test_create_product_bundle(PORT);
    id = productBundle.data.id;
  }

  const response = await axios(`http://localhost:${PORT}/seller/product-bundle/${id}`, {
    method: 'Patch',
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      name: option?.name ?? v4(),
      chargeStandard: option?.chargeStandard ?? 'MAX',
    } satisfies Partial<CreateProductBundleDto>,
  });

  return response.data as Awaited<ReturnType<SellerController['updateProductBundle']>>;
}
