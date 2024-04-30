import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CompanyController } from 'src/controllers/company.controller';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyRepository } from 'src/repositories/company.repository';
import { CompanyService } from 'src/services/company.service';
import { PrismaService } from 'src/services/prisma.service';

describe('Controller', () => {
  let controller: CompanyController;
  let service: CompanyService;
  let repository: CompanyRepository;
  let prisma: PrismaService;

  let testSellerId: number;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    controller = module.get<CompanyController>(CompanyController);
    repository = module.get<CompanyRepository>(CompanyRepository);
    prisma = module.get<PrismaService>(PrismaService);

    /**
     * 테스트시 사용할 판매자 계정의 아이디를 가져옵니다.
     */
    const testId = await prisma.seller.findFirst({ select: { id: true } });
    if (testId) {
      testSellerId = testId.id;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
    expect(prisma).toBeDefined();
    expect(testSellerId).toBeDefined();
  });

  it('테스트 판매자 계정을 가져와야 한다.', () => {
    expect(testSellerId).not.toBe(null);
  });

  describe('POST company', () => {
    it.todo('판매자는 누구나 회사를 등록할 수 있어야 한다.');

    /**
     * 회사는 모두 유니크해야 하며, 회사의 동일 여부는 회사의 사업자 번호를 기준으로 해야 한다.
     * 사업자 번호에 대한 칼럼을 추가하고, 해당 칼럼을 비교하여 이미 존재할 경우 업데이트를 헤야 한다.
     * 단, 업데이트할 때에는 이전에 정보가 추가되었을 가능성을 고려하기 때문이다.
     *
     * 예컨대, 이전 정보에서는 회사의 대표 전화번호가 없었지만, 다른 판매자가 대표 전화번호를 알고 저장할 수도 있기 때문.
     */
    it.todo('기존에 이미 있는 회사일 경우에는 새로 등록되지 않아야 한다.');

    /**
     * 해당 정보는 입력을 받아 조회하는 게 아니라, 미리 국세청 등 공공 API를 통해 저장해야 한다.
     * 저장 시점은 POST로 회사를 저장할 때 일어나야 한다.
     * 아래 테스트 코드 외에도 공공 API를 통해 미리 알아낼 수 있는 정보는 다 저장하는 것이 좋다.
     *
     * 회사의 종목이 달라지는 등의 일은 일단 고려하지 않는다.
     * 빈번하게 업데이트가 일어날 수 있는 항목이 아니기 때문에, 판매자의 저장 시점마다 고려한다.
     */
    it.todo('회사는 저장 시 공공 API를 이용해 업종, 업태, 종목 등의 정보를 저장해야 한다.');

    /**
     * 먼 미래의 도전 과제
     */
    it.todo('데이터의 변화 과정을 저장할 수 있는 company history table');
  });

  describe('GET company', () => {
    it('company를 페이지네이션으로 조회할 수 있어야 한다.', async () => {
      /**
       * 테스트할 company를 미리 추가 합니다.
       * testCount 만큼 company를 생성
       */
      const testCount = 10;
      const testName = v4();
      const companys = new Array(testCount).fill(0).map(() => {
        return { name: testName };
      });
      await prisma.company.createMany({ data: companys });

      /**
       * 테스트 페이지 설정
       */
      const testPaginationDto: PaginationDto = { page: 1, limit: testCount };

      const company = await controller.getCompany(testSellerId, testPaginationDto);

      expect(company.data.length).toBe(testPaginationDto.limit);
      expect(company.meta.page).toBe(testPaginationDto.page);
      expect(company.meta.take).toBe(testPaginationDto.limit);
      expect(company.meta.totalCount).toBeDefined();
      expect(company.meta.totalPage).toBeDefined();

      /**
       * 테스트 데이터 삭제
       */
      await prisma.company.deleteMany({ where: { name: testName } });
    });

    it('페이지 네이션으로 다음 페이지를 조회할 수 있다.', async () => {
      /**
       * 테스트할 company를 미리 추가 합니다.
       * testCount 만큼 company를 생성
       */
      const testCount = 100;
      const testName = v4();
      const companys = new Array(testCount).fill(0).map(() => {
        return { name: testName };
      });

      await prisma.company.createMany({ data: companys });

      const testPaginationDto: PaginationDto = { page: 1, limit: 20 };
      const firstPageData = await controller.getCompany(testSellerId, testPaginationDto);
      expect(firstPageData.meta.page).toBe(testPaginationDto.page);
      expect(firstPageData.data.length).toBe(testPaginationDto.limit);
      expect(firstPageData.meta.take).toBe(testPaginationDto.limit);

      testPaginationDto.page = 2;
      const secondPageData = await controller.getCompany(testSellerId, testPaginationDto);

      expect(secondPageData.meta.page).toBe(testPaginationDto.page);
      expect(secondPageData.data.length).toBe(testPaginationDto.limit);
      expect(secondPageData.meta.take).toBe(testPaginationDto.limit);

      expect(firstPageData.meta.totalCount).toBe(secondPageData.meta.totalCount);
      expect(firstPageData.meta.totalPage).toBe(secondPageData.meta.totalPage);

      /**
       * 테스트 데이터 삭제
       */
      await prisma.company.deleteMany({ where: { name: testName } });
    });

    it.todo('사업자 번호를 통한 검색이 가능해야 한다.');
    it.todo('회사 이름으로 검색이 가능해야 한다.');
    it.todo('회사의 업종, 업태, 종목 등 상세한 정보가 조회되어야 한다.');
  });
});
