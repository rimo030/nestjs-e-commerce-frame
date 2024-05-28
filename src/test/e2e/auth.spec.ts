import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { test_seller_sign_in } from '../features/auth/test_seller_sign_in';
import { test_seller_sign_up } from '../features/auth/test_seller_sign_up';

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
    it('판매자 회원 가입에 성공해야 한다.', async () => {
      const response = await test_seller_sign_up(PORT);

      expect(response.data.id).toBeDefined();
    });

    it(`판매자 로그인에 성공해야 한다. 회원가입이 실패할 경우, 함께 실패한다.`, async () => {
      const response = await test_seller_sign_in(PORT, {
        email: `${v4().slice(0, 100)}@gmail.com`,
        password: v4().slice(0, 20),
      });

      expect(response.data.accessToken).toBeDefined();
      expect(typeof response.data.accessToken === 'string').toBe(true);
    });
  });
});
