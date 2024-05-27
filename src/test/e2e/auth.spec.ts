import { randomInt } from 'crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
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
    it('판매자 회원 가입에 성공해야 한다. (e2e)', async () => {
      const response = await test_seller_sign_up(PORT);

      expect(response.data.id).toBeDefined();
    });
  });
});
