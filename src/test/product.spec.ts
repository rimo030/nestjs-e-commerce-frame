import { Test } from '@nestjs/testing';
import { CompanyEntity } from 'src/entities/company.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductController } from './.controller';
import { ProductService } from './.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    controller = module.get<ProductController>(ProductController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = ['test'];
      //   jest.spyOn(new ProductService2(), 'abc').mockImplementation(() => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  /**
   * 조건 1.
   *
   * 회사가 없다고 해서 테스트를 보류해서는 안 된다.
   * 여기서는 회사가 존재한다는 전제로 테스트 해야한다. 따라서 회사 객체를 만들거나, 진짜 회사 데이터를 만들거나,
   * 상품 테스트 코드는 회사에 독립적으로 진행될 수 있어야 한다.
   */
  describe('', () => {
    let company: CompanyEntity;
    beforeAll(async () => {
      const entity = new CompanyEntity();

      /**
       * 상품 생성하기의 TODO를 참고하라.
       *
       * {@link 논의한 내역이 있다면 링크를 추가할 것}
       *
       * 만약 허가 칼럼이 추가된다면 아래의 코드를 사용한다.
       */
      // entity.허가날짜 = new Date();

      company = await entity.save();
    });

    afterAll(async () => {
      await company.remove();
    });

    describe('상품 생성하기', () => {
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
      it.skip('상품을 생성할 때에는 우리 측의 허가를 받은 회사만 생성 가능하다.');

      /**
       * 로그 테이블로 관리하는 것의 장점
       * - 만약 허가 받고, 거절 당하고 그 이력을 관리하고 싶다면?
       *      - 허가 받은지
       */
      it.skip('허가 받은지 1년이 지난 경우라면 어떻게 해야 하는가?');

      /**
       * 판매자는 상품의 이름, 상품의 이미지를 입력해야 한다.
       *    - 단, 별도의 API를 이용해서 수정이 가능해야 한다.
       *        - 여기서 말하는 별도의 옵션이란, 사실 수정이 아니라 옵션을 추가하고 이미지를 추가하는 행위를 말한다.
       *
       * 여기서는 상품에, 이미지 1개에 옵션 1개가 있다는 가정으로 생성한다.
       */
      it.todo('상품이 등록되어야 한다.');
    });

    /**
     * GET products?page=1&limit=15&category=&sellerId=&
     */
    describe('구매자 입장에서의 조회 로직', () => {
      /**
       * 대표 가격은 입력한 옵션 중 자동으로 최솟값이 들어가야 한다.
       *    - 여기서 말하는 입력한 옵션이란, 품절과 판매가 중단된, 그리고 삭제된 옵션을 모두 제외한 후의 최솟값이다.
       * 이미지는 등록 순으로 정렬되어야 하며, 리스트에서는 이미지가 1장이면 되기 때문에 썸네일로 제공되어야 한다.
       *    - 이미지는 등록 순이기 때문에 가장 먼저 등록된 것을 썸네일로 삼는다.
       *        - 단, 이미지 테이블이 없다면 고려할 필요 없다.
       *
       *
       */
      it.todo('상품에 어떤 페이지도 주지 않을 경우 1페이지가 나와야 한다.');

      interface ProductElement extends ProductEntity {
        id: number;

        currency: 'WON';

        /**
         * 순서대로, 무료, 무조건 유료, 몇 개 이상 무료, 개수 당 배송비 부과 방식을 의미한다.
         */
        feeType: 'Free' | 'Charge' | 'OverFree' | 'OverQuantity' | 'Quantity';

        /**
         * 몇 개 이상, 또는 얼마 이상을 의미하는 말로, feeType과 함께 해석해야 한다.
         *
         * 프로퍼티 이름은 적절히 수정한다.
         */
        배송비_무료_기준_값: number;

        /**
         * 구매 가능 여부
         */
        isSale: boolean;

        /**
         * 대표 가격
         * 옵션 중에 가장 저렴한 것을 선택하되, '반드시 현재 구매 가능한 상태' 중의 최솟값이어야 한다.
         *      구매 불가능한 상품 가격을 노출하는 것은 조작의 위험이 있다.
         */
        representivePrice: number;

        /**
         * 상품 이미지를 조인해서 대표 이미지를 1개 시간 값 가장 오래 된 순으로 가져와야 한다.
         */
        thumbnailImage: string;

        /**
         * 상품의 정보는 아니지만 아래 정보는 조인을 통해서 가져와야 한다.
         */
        isFreeDelivery: boolean;

        /**
         * 상품의 판매자, 유통회사가 아니라 상품을 제조한 회사를 의미한다.
         * 농심 신라면의 경우 농심이 브랜드이며, 그걸 유통한 A, 최종 판매자인 B는 브랜드 이름이 될 수 없다.
         */
        sellerBrandName: String;

        /**
         * 프로퍼티 명은 수정해도 되며, 필요 시 다른 커머스를 참고해서 용어를 통일한다.
         *
         * 리뷰 별점을 의미한다.
         * 한 명의 유저가 기록할 때마다 수정하려면 너무 많은 연산이 필요하기 떄문에 미리 저장해둔다.
         * 즉, 별도의 칼럼에 저장한다.
         */
        averagePoint: number;

        /**
         * 리뷰의 수
         *
         * 조인해서 가져와야 한다.
         * 칼럼에 저장하지 않는다.
         *
         * 리뷰가 너무 많아져서 렉이 걸리는 경우가 발생한다면 이 또한 DB에 저장해서 관리한다.
         */
        reviewCount: number;
      }

      type GetProductResponse = {
        data: {
          productList: ProductElement[];
        };

        meta: {
          /**
           * 전체 페이지가 몇인지를 의미한다.
           */
          totalPage: number;

          /**
           * 유저가 요청한 페이지 당 데이터의 개수로, 1보다 크며 최대 값은 제한이 있다.
           */
          limit: number;

          /**
           * 프론트에서는 이 값과 totalPage를 비교해서 다음 페이지가 있는지 알 수 있다.
           */
          page: number;

          /**
           * 스크롤 기반에서 사용하기 위해서 마지막 상품 아이디를 제공한다.
           *    이걸 제공하는 이유는 추후에 모바일을 지원하기 위해 미리 프로퍼티를 할당해두는 것이다.
           *    모바일은 스크롤 기반으로 제공될 것
           */
          lastProductId: number;

          /**
           * 유저가 검색한 키워드를 다시 돌려준다.
           * 프론트에서 이 데이터를 어떻게 해서 조회할 수 있었는지 보기 위함.
           *
           * 없을 경우 null 이다.
           */
          search: string | null;

          /**
           * 유저가 조회 요청을 할 때 카테고리를 넘긴 경우 카테고리 아이디를 보여준다.
           */
          categoryId: string | null;

          /**
           * 판매자 별로 보고자 했을 때
           */
          sellerId: number | null;
        };
      };

      it('category 별 조회가 가능해야 한다.', async () => {
        const 조회할_카테고리_값 = 1;
        const productList: GetProductResponse = await controller.find({
          page: 1,

          /**
           * limit에는 최댓값에 제한이 걸려 있다.
           */
          limit: 15,
          categoryId: 조회할_카테고리_값,
        });

        expect(typeof productList.data.productList.length === 'number').toBe(true);
        expect(productList.data.productList.every((el) => el.categoryId === 조회할_카테고리_값)).toBe(true);

        /**
         * 컨트롤러의 개수 제한을 넘어선 숫자로 검증을 다시 했을 때도 동일해야 한다.
         * 우연의 일치로 하필 조회한 데이터가 전부 카테고리 아이디와 일치했을 가능성을 배제하기 위해 서비스로 20페이지를 체크한다.
         */
        const productListByProductService = await service.find({
          page: 1,
          limit: 300,
        });

        expect(productListByProductService.every((el) => el.categoryId === 조회할_카테고리_값)).toBe(true);
      });
    });
  });
});
