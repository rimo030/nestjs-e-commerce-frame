import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { test_seller_sign_in } from '../features/auth/test_seller_sign_in';
import { test_seller_sign_up } from '../features/auth/test_seller_sign_up';
import { test_seller_create_product } from '../features/sellers/test_seller_create_product';

describe('Controller', () => {
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

  describe('Seller 테스트', () => {
    it('POST seller/product', async () => {});
  });
});
