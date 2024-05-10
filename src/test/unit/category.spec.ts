import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CategoryController } from 'src/controllers/category.controller';
import { GetPaginationDto } from 'src/entities/dtos/get-pagination.dto';
import { CategoryService } from 'src/services/category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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

  describe('GET category', () => {
    it('카테고리를 페이지네이션으로 조회할 수 있어야 한다.', async () => {
      /**
       * 테스트할 카테고리를 미리 추가 합니다.
       */
      const testCount = 10;
      const categorys = new Array(testCount).fill(0).map(() => {
        return { name: v4() };
      });

      await service.createCategories(categorys);

      /**
       * 테스트 페이지 설정
       */
      const testPaginationDto: GetPaginationDto = { page: 1, limit: testCount };

      const category = await controller.getCategory(testPaginationDto);

      expect(category.data.length).toBe(testPaginationDto.limit);
      expect(category.meta.page).toBe(testPaginationDto.page);
      expect(category.meta.take).toBe(testPaginationDto.limit);
      expect(category.meta.totalCount).toBeDefined();
      expect(category.meta.totalPage).toBeDefined();
    });

    it('페이지 네이션으로 다음 페이지를 조회할 수 있다.', async () => {
      /**
       * 테스트할 카테고리를 미리 추가 합니다.
       */
      const testCount = 100;
      const categorys = new Array(testCount).fill(0).map(() => {
        return { name: v4() };
      });

      await service.createCategories(categorys);

      const testPaginationDto: GetPaginationDto = { page: 1, limit: 20 };
      const firstPageData = await controller.getCategory(testPaginationDto);
      expect(firstPageData.meta.page).toBe(testPaginationDto.page);
      expect(firstPageData.data.length).toBe(testPaginationDto.limit);
      expect(firstPageData.meta.take).toBe(testPaginationDto.limit);

      testPaginationDto.page = 2;
      const secondPageData = await controller.getCategory(testPaginationDto);

      expect(secondPageData.meta.page).toBe(testPaginationDto.page);
      expect(secondPageData.data.length).toBe(testPaginationDto.limit);
      expect(secondPageData.meta.take).toBe(testPaginationDto.limit);

      expect(firstPageData.meta.totalCount).toBe(secondPageData.meta.totalCount);
      expect(firstPageData.meta.totalPage).toBe(secondPageData.meta.totalPage);
    });
  });
});
