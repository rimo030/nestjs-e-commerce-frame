import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SellerController } from 'src/controllers/sellers.controller';
import { SellerService } from 'src/services/sellers.service';

describe('SellerController', () => {
  let controller: SellerController;
  let service: SellerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SellerService>(SellerService);
    controller = module.get<SellerController>(SellerController);
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('POST /product (상품 생성하기)', () => {
    /**
     * 백엔드 시점
     *
     * 상품 생성에 허가가 필요하다면 칼럼을 두고 관리를 해야 한다.
     * 단, 여기선 어떻게 기획 의도가 바뀔지 모르기 때문에 허가 받은 날짜를 명시하는 것이 더 나을 것 같다.
     * 따라서 `상품 판매 허가` 날짜 칼럼을 만든다. -> 기획자에게 허가가 취소될 수 있는건지도 물어본다.
     *  - 필요 시 로그로 관리하기 위해 날짜 칼럼이 아니라 `허가 로그 테이블`을 만든다.
     *      - 이번에는 이것에 대한 테스트는 하지 않는다.
     *
     * 상품을 생성할 때는 회사의 아이디로 회사를 조회해서 회사의 `상품 판매 허가`를 확인한 후 생성을 해줘야 한다.
     * 만약 아직 허가 받지 않은 회사라면, 상품을 등록하지 않고 허가를 받으라는 에러 메시지를 출력한다. -> 디자이너에게 문구를 받아야 한다.
     */
    it.todo('상품을 생성할 때에는 우리 측의 허가를 받은 회사만 생성 가능하다.');

    /**
     * 로그 테이블로 관리하는 것의 장점
     * - 만약 허가 받고, 거절 당하고 그 이력을 관리하고 싶다면?
     *      - 허가 받은지
     */
    it.todo('허가 받은지 1년이 지난 경우라면 어떻게 해야 하는가?');

    /**
     * 판매자는 상품의 이름, 상품의 이미지를 입력해야 한다.
     *    - 단, 별도의 API를 이용해서 수정이 가능해야 한다.
     *        - 여기서 말하는 별도의 옵션이란, 사실 수정이 아니라 옵션을 추가하고 이미지를 추가하는 행위를 말한다.
     *
     * 여기서는 상품에, 이미지 1개에 옵션 1개가 있다는 가정으로 생성한다.
     */
    it.only('상품이 등록되어야 한다.', async () => {});
  });
});
