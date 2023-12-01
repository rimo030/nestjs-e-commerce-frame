import { v4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ProductController } from 'src/controllers/product.controller';
import { SellerController } from 'src/controllers/seller.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { CompanyEntity } from 'src/entities/company.entity';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { Payload } from 'src/interfaces/payload';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/products.required.option.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { SellerService } from 'src/services/seller.service';

describe('SellerController', () => {
  let jwtService: JwtService;

  let sellercontroller: SellerController;
  let sellerservice: SellerService;
  let sellerRepository: SellerRepository;

  let authController: AuthController;
  let authService: AuthService;

  let productController: ProductController;
  let productRespository: ProductRepository;

  let productsRequiredRespository: ProductRequiredOptionRepository;
  let productsOptionRespository: ProductOptionRepository;

  let accessToken: string | null = null;

  /**
   * 구매자 사이드
   */

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sellercontroller = module.get<SellerController>(SellerController);
    sellerservice = module.get<SellerService>(SellerService);
    sellerRepository = module.get<SellerRepository>(SellerRepository);

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    productController = module.get<ProductController>(ProductController);

    productRespository = module.get<ProductRepository>(ProductRepository);
    productsRequiredRespository = module.get<ProductRequiredOptionRepository>(ProductRequiredOptionRepository);
    productsOptionRespository = module.get<ProductOptionRepository>(ProductOptionRepository);

    jwtService = module.get<JwtService>(JwtService);

    /**
     * 판매자 계정생성 및 로그인
     */
    const randomStringForTest = v4();
    const createSellerDto: CreateSellerDto = {
      email: randomStringForTest,
      password: randomStringForTest,
      name: randomStringForTest.slice(0, 32),
      phone: randomStringForTest.slice(0, 11),
      businessNumber: randomStringForTest,
    };

    await authController.sellerSignUp(createSellerDto);

    const createdSeller = await sellerRepository.findOne({
      select: {
        id: true,
      },
      where: {
        email: randomStringForTest,
      },
    });

    const tokenDto: AccessToken = await authService.sellerLogin(createdSeller?.id as number);
    accessToken = tokenDto.accessToken;
  });

  it('should be defined.', async () => {
    expect(sellercontroller).toBeDefined();
    expect(sellerservice).toBeDefined();
    expect(authController).toBeDefined();
  });

  it('테스트 시작 전에 토큰이 만들어졌는지 체크한다.', () => {
    expect(accessToken).toBeDefined();
    expect(accessToken !== null).toBe(true);
  });

  describe.only('POST /product (상품 생성하기)', () => {
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
    describe('상품 등록 시 상품이 추가되는 것을 검증한다.', () => {
      it('상품이 존재한다는 것이 데이터베이스 레벨에서 증명된다.', async () => {
        /**
         * 상품을 만든다.
         */
        const decoded: Payload = jwtService.decode(accessToken!);
        const product = await sellercontroller.createProduct(decoded.id, {
          categoryId: (await new CategoryEntity({ name: 'name' }).save()).id,
          companyId: (await new CompanyEntity({ name: 'name' }).save()).id,
          isSale: 1,
          name: 'name',
          description: 'description',
          deliveryCharge: 3000,
          deliveryFreeOver: 30000,
          deliveryType: 'COUNT_FREE',
          img: 'img.jpg',
        });

        /**
         * 데이터베이스에 있음을 검증
         */
        const createdInDatabase = await productRespository.findOne({ where: { id: product.id } });
        expect(createdInDatabase).toBeDefined();
      });

      it.skip('상품이 존재한다는 것이 판매자 사이드에서 증명되어야 한다.', () => {});

      /**
       * 여기서 말하는 구매자는 구매자 API를 호출했을 때를 의미하며,
       * 이 API는 로그인과 무관하게 동작해야 한다.
       *
       * 이 부분은 추후 구매자 플로우에서 증명을 다시 한다.
       */
      it('상품이 존재한다는 것이 구매자 사이드에서 증명되어야 한다.', async () => {
        /**
         * 상품을 만든다.
         */
        const decoded: Payload = jwtService.decode(accessToken!);
        const product = await sellercontroller.createProduct(decoded.id, {
          categoryId: (await new CategoryEntity({ name: 'name' }).save()).id,
          companyId: (await new CompanyEntity({ name: 'name' }).save()).id,
          isSale: 0,
          name: 'name',
          description: 'description',
          deliveryCharge: 3000,
          deliveryFreeOver: 30000,
          deliveryType: 'COUNT_FREE',
          img: 'img.jpg',
        });

        /**
         * 상품이 있다면 유저 쪽에서 조회 API를 했을 때 나와야 한다.
         */
        const productList = await productController.getProductList({
          limit: 1,
          page: 1,
          sellerId: decoded.id,
        });

        expect(productList?.length).toBe(1);
      });
    });

    /**
     * 판매자는 등록한 상품에 대해 id를 발급받는다.
     *
     * 판매자는 id가 발급된 상품에 대하여 필수옵션, 선택옵션을 추가/조회/삭제할 수 있다.
     *  - DB 칼럼이 같으므로 하나의 api로 만든다.
     *    - 필수옵션, 선택옵션의 여부는 isRequire 쿼리 파라미터를 기준으로 한다.
     *      - /product/:id/option?isRequire=true  <<< 필수 옵션
     *      - /product/:id/option?isRequire=false  <<< 선택 옵션
     *
     *  - 등록된 필수 옵션, 선택옵션은 각각 id를 발급받는다.
     *  - 상품이 삭제되면 해당 상품의 필수 옵션과 선택옵션은 함께 삭제된다.
     *
     * 판매자는 id가 발급된 필수 옵션에 대하여 입력 옵션을 추가/조회/삭제 할 수 있다.
     *
     */
    describe('등록된 상품에 대하여 필수 옵션/ 선택옵션이 추가되는 것을 검증한다.', () => {
      it('필수 옵션과 선택옵션이 추가되면 그 id를 DB에서 조회할 수 있어야 한다.', async () => {
        /**
         * 상품 1개 가져오기
         */
        const decoded: Payload = jwtService.decode(accessToken!);
        const product = await productController.getProductList({
          limit: 1,
          page: 1,
        });

        const isRequire = true;

        if (product) {
          const productId = product[0].id;

          /**
           * 필수 옵션 추가
           */

          const requireOption = await sellercontroller.createProductOptions(decoded.id, productId, isRequire, {
            name: 'name',
            price: 0,
            stock: 0,
            isSale: 0,
          });
          /**
           * 선택 옵션 추가
           */
          const option = await sellercontroller.createProductOptions(decoded.id, productId, !isRequire, {
            name: 'name',
            price: 0,
            stock: 0,
            isSale: 0,
          });

          /**
           * 데이터 베이스에서 조회
           */
          const ro = await productsRequiredRespository.findOneBy({ id: requireOption.id });
          const o = await productsOptionRespository.findOneBy({ id: option.id });
          expect(ro === null).toBe(false);
          expect(o === null).toBe(false);
        }
      });
    });
  });
});
