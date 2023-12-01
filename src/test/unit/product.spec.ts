import { Test } from '@nestjs/testing';
import { ProductController } from 'src/controllers/product.controller';
import { CompanyEntity } from 'src/entities/company.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductService } from 'src/services/product.service';

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

    /**
     * GET products?page=1&limit=15&category=&sellerId=&
     * GET categories/:categoryId/products?page=1&limit=15 ...
     *
     * 엔드포인트를 2개 가질 수도 있다.
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
        deliveryType: 'Free' | 'Charge' | 'OverFree' | 'OverQuantity' | 'Quantity';

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

    /**
     * 상품의 상세 페이지 조회
     */
    describe('GET products/:id', () => {
      /**
       * 상품의 이름을 포함한 기본적인 정보 전체와,
       * 옵션 10개, 선택 옵션 10개를 가져온다.
       * 이렇게 옵션을 미리 가져 오는 이유는 상품 조회, 페이지 이동, 옵션 조회 등 API가 나뉘는 것을 방지하기 위함이다.
       * 이렇게 한 번의 요청으로 가져온 후 이후 필요한 데이터를 추가적인 API로 가져오는 게 성능 상 유리하다.
       * 네트워크 대역폭을 아낄 수 있기 때문이다.
       */
      it.todo('상품의 상세 페이지를 조회한다.');

      /**
       * 추천 상품 기준은, 여기서는 편의 상 동일 카테고리를 기준으로 한다.
       */
      it.todo('상품 상세 페이지 조회 시에는 상품의 추천 상품 10개가 함께 보여져야 한다.');
    });

    describe('GET products/:id/options?required=', () => {
      /**
       * 상품의 옵션 조회 시 쿼리로 받은 requried true, false를 통해 선택 옵션과 그렇지 않은 경우를 구분할 수 있어야 한다.
       * 당연히 페이지네이션이어야 하며, 1페이지가 default로 조회되어야 한다.
       * 상품의 최초 조회 시 상품의 옵션들이 조회되기 때문에 서비스 로직은 재사용될 수 있어야 한다.
       */
      it.todo('상품의 옵션을 페이지네이션으로 조회한다.');

      /**
       * 입력 옵션이 존재할 경우 배열에 담겨서 보여진다.
       * 없을 경우 빈 배열이며, 빈 배열이면 데이터가 빈 것이 아니라 입력 옵션이 없는 것과 동일하게 처리될 것이다.
       */
      it.todo('필수 옵션의 경우, 선택 옵션과 달리 입력 옵션이 있을 경우 입력 옵션들이 함께 보여져야 한다.');

      /**
       * 즉, 먼저 생긴 옵션이 가장 위에 보여져야 한다.
       */
      it.todo('옵션은 id 값을 기준으로 정렬되어 보여져야 한다.');

      /**
       * 먼 미래에 도전했으면 하는 사항.
       *
       * 예를 들어 '홍길동' 인지, 영문 이름으로 'hong-gil-dong'인지, 아니면 숫자만 받는지 등 조건이 있을 것이다.
       * 해당 조건들을 따로 칼럼으로 가지고 있다면 더 대응의 폭이 넓어질 것이다.
       */
      it.todo('입력 옵션에는 어떠한 정규식 패턴을 사용할 것인지를 의미하는 Enum 칼럼이 존재해야 한다.');
    });
  });
});
