import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CategoryController } from 'src/controllers/category.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryService } from 'src/services/category.service';

describe('CategoryController', () => {
  let Controller: CategoryController;
  let Service: CategoryService;
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    Service = module.get<CategoryService>(CategoryService);
    Controller = module.get<CategoryController>(CategoryController);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined.', async () => {
    expect(Controller).toBeDefined();
    expect(Service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('서버 실행 시 카테고리 데이터를 추가하는 스크립트', () => {
    /**
     * 중복된 카테고리가 생겨서도 안 된다.
     * 이미 있을 경우에는 생성하지 말아야 한다.
     * 이러한 기본 값 생성 스크립트는 서버 코드와 무관하게 하나의 스크립트로 작성되어야 한다.
     *
     * 어렵다면 일단 넘긴다.
     */
    it.todo('서버 최초 실행 시 기본적인 카테고리 셋이 없을 경우 추가한다.');
  });

  describe('GET categories', () => {
    /**
     * 카테고리는 이미 들어 있는 rows 라고 가정한다.
     * 따라서 새로 추가하는 등 POST API는 없고 오로지 조회 요청만을 테스트한다.
     *
     */
    it('카테고리가 조회되어야 한다.', async () => {
      /**
       * 카테고리를 10개 생성한다.
       * 카테고리 명은 unique 해야한다.
       */

      const entities = new Array(10).fill(0).map((el) => new CategoryEntity({ name: v4() }));
      await repository.save(entities);

      /**
       * 저장한 카테고리를 조회할 수 있는 지 확인한다.
       */
      const categorylist = Controller.getCategory({ page: 1, limit: 10 });
      expect((await categorylist).data.list.length).toBe(10);
    });
  });
});
