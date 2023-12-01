import { Test } from '@nestjs/testing';
import { CategoryController } from './.controller';
import { CategoryService } from './.service';

describe('CategoryController', () => {
  let Controller: CategoryController;
  let Service: CategoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    Service = module.get<CategoryService>(CategoryService);
    Controller = module.get<CategoryController>(CategoryController);
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
     */
    it.todo('카테고리가 조회되어야 한다.');
  });
});