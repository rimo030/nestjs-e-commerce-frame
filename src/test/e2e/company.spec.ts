import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { test_seller_sign_up } from '../features/auth/test_seller_sign_up';
import { test_create_companies } from '../features/companies/test_company_create_companies';
import { test_create_company } from '../features/companies/test_company_create_company';

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

  describe('Company 테스트', () => {
    it('회사 등록에 성공해야 한다.', async () => {
      const response = await test_create_company(PORT);

      expect(response.data.id).toBeDefined();
    });

    it('판매자 계정으로 회사 등록에 성공해야 한다.', async () => {
      const { data: seller } = await test_seller_sign_up(PORT);
      const testname = v4();
      const response = await test_create_company(PORT, seller.accessToken, { name: testname });

      expect(response.data.id).toBeDefined();
      expect(response.data.name).toBe(testname);
    });

    it('회사 다수 등록에 성공해야 한다.', async () => {
      const response = await test_create_companies(PORT);

      expect(response.data.every(Boolean)).toBeDefined();
    });
  });
});
