import { Test } from '@nestjs/testing';
import { CompanyService } from './.service';

describe('Company Test suite', () => {
  let Service: CompanyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CompanyService],
    }).compile();

    Service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
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
     * 먼 미래의 도전 과제
     */
    it.todo('데이터의 변화 과정을 저장할 수 있는 company history table');
  });
});
