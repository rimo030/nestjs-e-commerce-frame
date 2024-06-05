import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { test_seller_sign_up } from '../features/auth/test_seller_sign_up';
import { test_create_category } from '../features/categories/test_category_create_category';
import { test_create_company } from '../features/companies/test_company_create_company';
import { test_update_product } from '../features/sellers/test_seller-update_product';
import { test_create_product } from '../features/sellers/test_seller_create_product';
import { test_create_product_bundle } from '../features/sellers/test_seller_create_product_bundle';
import { test_update_product_bundle } from '../features/sellers/test_seller_update_product_bundle';

describe('Seller Controller', () => {
  const PORT = randomInt(20000, 50000);
  let server: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();
    server = await app.init();
    await server.listen(PORT);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST', () => {
    it('seller는 상품 묶음을 생성할 수 있다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);
      const response = await test_create_product_bundle(PORT, seller.accessToken);

      expect(response.data.id).toBeDefined();
      expect(response.data.sellerId).toBe(seller.id);
    });

    it('seller는 상품을 생성할 수 있다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);
      const { data: bundle } = await test_create_product_bundle(PORT, seller.accessToken);
      const { data: company } = await test_create_company(PORT, seller.accessToken);
      const { data: category } = await test_create_category(PORT);

      const response = await test_create_product(
        PORT,
        { bundleId: bundle.id, categoryId: category.id, companyId: company.id },
        seller.accessToken,
      );

      expect(response.data.id).toBeDefined();
      expect(response.data.sellerId).toBe(seller.id);
      expect(response.data.bundleId).toBe(bundle.id);
      expect(response.data.companyId).toBe(company.id);
      expect(response.data.categoryId).toBe(category.id);
    });
  });

  describe('Patch', () => {
    it('seller는 상품 묶음을 수정할 수 있다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);
      const { data: productBundle } = await test_create_product_bundle(PORT, seller.accessToken, {
        name: v4(),
        chargeStandard: 'MAX',
      });

      const testUpdateData: Partial<CreateProductBundleDto> = {
        name: v4(),
        chargeStandard: 'MIN',
      };
      const response = await test_update_product_bundle(PORT, seller.accessToken, productBundle.id, testUpdateData);

      expect(response.data.id).toBeDefined();
      expect(response.data.sellerId).toBe(seller.id);
      expect(response.data.id).toBe(productBundle.id);
      expect(response.data.name).toBe(testUpdateData.name);
      expect(response.data.chargeStandard).toBe(testUpdateData.chargeStandard);
    });

    it('seller는 상품을 수정할 수 있다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);
      const { data: bundle } = await test_create_product_bundle(PORT, seller.accessToken);
      const { data: company } = await test_create_company(PORT, seller.accessToken);
      const { data: category } = await test_create_category(PORT);

      const { data: product } = await test_create_product(PORT, {}, seller.accessToken);

      const testUpdateData: Partial<CreateProductDto> = {
        bundleId: bundle.id,
        categoryId: category.id,
        companyId: company.id,
        isSale: false,
        name: v4(),
        description: v4(),
        deliveryType: 'COUNT_FREE',
        deliveryCharge: Math.floor(Math.random() * 101),
        deliveryFreeOver: Math.floor(Math.random() * 11),
        img: v4(),
      };

      const response = await test_update_product(PORT, product.id, testUpdateData, seller.accessToken);

      expect(response.data.id).toBeDefined();
      expect(response.data.sellerId).toBe(seller.id);

      expect(response.data.bundleId).toBe(testUpdateData.bundleId);
      expect(response.data.categoryId).toBe(testUpdateData.categoryId);
      expect(response.data.companyId).toBe(testUpdateData.companyId);
      expect(response.data.isSale).toBe(testUpdateData.isSale);
      expect(response.data.name).toBe(testUpdateData.name);
      expect(response.data.description).toBe(testUpdateData.description);
      expect(response.data.deliveryType).toBe(testUpdateData.deliveryType);
      expect(response.data.deliveryFreeOver).toBe(testUpdateData.deliveryFreeOver);
      expect(response.data.deliveryCharge).toBe(testUpdateData.deliveryCharge);
      expect(response.data.img).toBe(testUpdateData.img);
    });

    it('[err] seller는 상품의 상품 묶음을 수정할 경우, 본인이 생성한 상품 묶음으로만 수정할 수 있다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);

      const { data: seller2 } = await test_seller_sign_up(PORT);
      const { data: bundle } = await test_create_product_bundle(PORT, seller2.accessToken);

      const response = await test_create_product(PORT, { bundleId: bundle.id }, seller.accessToken);

      expect(seller.id).not.toBe(seller2.id);
      expect(response.data.id).not.toBeDefined();
    });
  });
});
