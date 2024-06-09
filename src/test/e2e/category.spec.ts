import { randomInt } from 'crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { test_create_categories } from '../features/categories/test_category_create_categories';
import { test_create_category } from '../features/categories/test_category_create_category';

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

  describe('Category 테스트', () => {
    it('카테고리 등록에 성공해야 한다.', async () => {
      const response = await test_create_category(PORT);

      expect(response.data.id).toBeDefined();
    });

    it('카테고리 다수 등록에 성공해야 한다.', async () => {
      const response = await test_create_categories(PORT);

      expect(response.data.length > 0).toBe(true);
      expect(response.data.every(Boolean)).toBe(true);
    });
  });
});
