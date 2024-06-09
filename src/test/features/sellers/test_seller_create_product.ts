import axios from 'axios';
import { v4 } from 'uuid';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { deliveryType } from 'src/types/delivery-type.type';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';
import { test_create_category } from '../categories/test_category_create_category';
import { test_create_company } from '../companies/test_company_create_company';
import { test_create_product_bundle } from './test_seller_create_product_bundle';

/**
 * 판매자가 직접 상품을 생성하는 상황을 가정한다.
 * 리턴되는 상품은 Mock data로, 아무런 의미도 가지고 있지 않다.
 * e2e 테스트를 위해 `fetch` 함수로 직접 테스트를 한다.
 *
 * @todo 추후 더 세밀한 테스트를 위해 option을 통해 상품을 세밀하게 수정할 수 있도록 한다.
 * @todo category 생성 API가 있어야 한다.
 * @todo company 생성 API가 있어야 한다.
 * @todo (optional) product bundle 생성 API가 있어야 한다.
 *
 * endpoint는 `POST seller/product` 에 해당한다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호
 * @param options 상품을 생성하기 위해 필요한 정보들
 */
export async function test_create_product(
  PORT: number,
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
): Promise<ReturnType<SellerController['createProduct']>> {
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

  let finalBundleId = bundleId;
  if (finalBundleId === undefined) {
    const { data: productBundle } = await test_create_product_bundle(PORT, accessToken);
    finalBundleId = productBundle.id;
  }

  let finalCompanyId = companyId;
  if (!finalCompanyId) {
    const { data: company } = await test_create_company(PORT, accessToken);
    finalCompanyId = company.id;
  }

  let finalCategoryId = categoryId;
  if (!finalCategoryId) {
    const { data: category } = await test_create_category(PORT);
    finalCategoryId = category.id;
  }

  const response = await axios(`http://localhost:${PORT}/seller/product`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      bundleId: finalBundleId,
      categoryId: finalCategoryId,
      companyId: finalCompanyId,
      isSale: isSale === undefined ? true : isSale,
      name: name === undefined ? v4() : name,
      description: description === undefined ? v4() : description,
      deliveryType: deliveryType === undefined ? 'FREE' : deliveryType,
      deliveryFreeOver: deliveryFreeOver === undefined ? null : deliveryFreeOver,
      deliveryCharge: deliveryCharge === undefined ? 0 : deliveryCharge,
      img: img === undefined ? v4() : img,
    } satisfies CreateProductDto,
  });

  return response.data as Awaited<ReturnType<SellerController['createProduct']>>;
}
