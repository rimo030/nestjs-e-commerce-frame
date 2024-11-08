import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { test_seller_sign_in } from '../features/auth/test_seller_sign_in';
import { test_seller_sign_up } from '../features/auth/test_seller_sign_up';
import { test_buyer_sign_in } from '../features/auth/test_buyer_sign_in';
import { test_buyer_sign_up } from '../features/auth/test_buyer_sign_up';

describe('Controller', () => {
  const PORT = randomInt(20000, 50000);
  let server: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    server = await app.init();
    await server.listen(PORT);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Buyer 테스트', () => {
    it('구매자 회원 가입에 성공해야 한다.', async () => {
      const response = await test_buyer_sign_up(PORT);

      expect(response.data.id).toBeDefined();
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.refreshToken).toBeDefined();
    });

    it(`구매자 로그인에 성공해야 한다. 회원가입이 실패할 경우, 함께 실패한다.`, async () => {
      const response = await test_buyer_sign_in(PORT, {
        email: `${v4()}@gmail.com`,
        password: v4().slice(0, 20),
      });
      expect(response.data).toBeDefined();
    });


    it(`구매자 로그인에 성공한 경우 AccessToken, RefreshToken이 발급되어야 한다.`, async () => {
      const response = await test_buyer_sign_in(PORT, {
        email: `${v4()}@gmail.com`,
        password: v4().slice(0, 20),
      });
      expect(response.data.id).toBeDefined();
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.refreshToken).toBeDefined();
    });
  });


  describe('Seller 테스트', () => {
    it('판매자 회원 가입에 성공해야 한다.', async () => {
      const response = await test_seller_sign_up(PORT);

      expect(response.data.id).toBeDefined();
    });

    it(`판매자 로그인에 성공해야 한다. 회원가입이 실패할 경우, 함께 실패한다.`, async () => {
      const response = await test_seller_sign_in(PORT, {
        email: `${v4()}@gmail.com`,
        password: v4().slice(0, 20),
      });

      expect(response.data.accessToken).toBeDefined();
      expect(typeof response.data.accessToken === 'string').toBe(true);
    });
  });
});
