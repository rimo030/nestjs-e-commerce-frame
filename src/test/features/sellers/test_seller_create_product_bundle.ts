import axios from 'axios';
import { v4 } from 'uuid';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';

/**
 * 상품 묶음 생성을 테스트 합니다.
 * 엔드포인트는 `POST seller/product-bundle` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param accessToken 인증에 사용할 판매자 토큰입니다. 주어지지 않을 경우 임의의 seller를 등록한 뒤 상품 묶음을 합니다.
 * @param option 저장할 상품 묶음의 데이터 입니다.
 */
export async function test_create_product_bundle(
  PORT: number,
  accessToken?: string,
  option?: CreateProductBundleDto,
): Promise<ReturnType<SellerController['createProductBundle']>> {
  if (!accessToken) {
    const signUpResponse = await test_seller_sign_up(PORT);
    accessToken = signUpResponse.data.accessToken;
  }

  const response = await axios(`http://localhost:${PORT}/seller/product-bundle`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      name: option?.name ?? v4(),
      chargeStandard: option?.chargeStandard ?? 'MAX',
    } satisfies CreateProductBundleDto,
  });

  return response.data as Awaited<ReturnType<SellerController['createProductBundle']>>;
}
