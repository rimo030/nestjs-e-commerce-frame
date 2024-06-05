import axios from 'axios';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { deliveryType } from 'src/types/delivery-type.type';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';

/**
 * 상품 수정을 테스트 합니다.
 * 엔드포인트는 `Patch seller/product/:id` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param id 수정할 상품의 아이디 입니다. 주어지지 않을 경우 임의의 상품을 생성한 뒤 수정합니다.
 * @param option 수정할 상품의 데이터 입니다.
 * @param accessToken 인증에 사용할 판매자 토큰입니다.
 */

export async function test_update_product(
  PORT: number,
  id: number,
  options: {
    bundleId?: number | null;
    categoryId?: number;
    companyId?: number;
    isSale?: boolean;
    name?: string;
    description?: string | null;
    deliveryType?: deliveryType;
    deliveryFreeOver?: number | null;
    deliveryCharge?: number;
    img?: string;
  },
  accessToken?: string,
): Promise<ReturnType<SellerController['updateProduct']>> {
  const {
    bundleId,
    categoryId,
    companyId,
    isSale,
    name,
    description,
    deliveryType,
    deliveryFreeOver,
    deliveryCharge,
    img,
  } = options;

  if (!accessToken) {
    const signUpResponse = await test_seller_sign_up(PORT);
    accessToken = signUpResponse.data.accessToken;
  }

  const response = await axios(`http://localhost:${PORT}/seller/product/${id}`, {
    method: 'Patch',
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      ...(bundleId !== undefined && { bundleId }),
      ...(categoryId && { categoryId }),
      ...(companyId && { companyId }),
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(isSale !== undefined && { isSale }),
      ...(deliveryType && { deliveryType }),
      ...(deliveryFreeOver !== undefined && { deliveryFreeOver }),
      ...(deliveryCharge && { deliveryCharge }),
      ...(img && { img }),
    } satisfies Partial<CreateProductDto>,
  });

  return response.data as Awaited<ReturnType<SellerController['updateProduct']>>;
}
