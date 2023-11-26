import { v4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ProductController } from 'src/controllers/products.controller';
import { SellerController } from 'src/controllers/sellers.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { CompanyEntity } from 'src/entities/company.entity';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { Payload } from 'src/interfaces/payload';
import { ProductsRespository } from 'src/repositories/products.repository';
import { SellersRespository } from 'src/repositories/sellers.repository';
import { SellerService } from 'src/services/sellers.service';

describe('SellerController', () => {
  let controller: SellerController;
  let service: SellerService;
  let authController: AuthController;
  let authService: AuthService;
  let sellersRespository: SellersRespository;
  let productsRespository: ProductsRespository;

  let jwtService: JwtService;

  /**
   * 구매자 사이드
   */

  let productController: ProductController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SellerService>(SellerService);
    controller = module.get<SellerController>(SellerController);

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    sellersRespository = module.get<SellersRespository>(SellersRespository);
    productsRespository = module.get<ProductsRespository>(ProductsRespository);

    jwtService = module.get<JwtService>(JwtService);

    productController = module.get<ProductController>(ProductController);
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(authController).toBeDefined();
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
      let accessToken: string | null = null;
      beforeAll(async () => {
        const randomStringForTest = v4();
        const createSellerDto: CreateSellerDto = {
          businessNumber: randomStringForTest,
          email: randomStringForTest,
          name: randomStringForTest.slice(0, 32),
          password: randomStringForTest,
          phone: randomStringForTest.slice(0, 11),
        };

        await authController.sellerSignUp(createSellerDto);
        const createdSeller = await sellersRespository.findOne({
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

      it('테스트 시작 전에 토큰이 만들어졌는지 체크한다.', () => {
        expect(accessToken).toBeDefined();
        expect(accessToken !== null).toBe(true);
      });

      it('상품이 존재한다는 것이 데이터베이스 레벨에서 증명된다.', async () => {
        /**
         * 상품을 만든다.
         */
        const decoded: Payload = jwtService.decode(accessToken!);
        const product = await controller.createProduct(decoded.id, {
          categoryId: (await new CategoryEntity({ name: 'name' }).save()).id,
          companyId: (await new CompanyEntity({ name: 'name' }).save()).id,
          deliveryCharge: 3000,
          deliveryFreeOver: 30000,
          deliveryType: 'COUNT_FREE',
          description: 'description',
          img: 'img.jpg',
          isSale: 1,
          name: 'name',
        });

        /**
         * 데이터베이스에 있음을 검증
         */
        const createdInDatabase = await productsRespository.findOne({ where: { id: product.id } });
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
        const product = await controller.createProduct(decoded.id, {
          categoryId: (await new CategoryEntity({ name: 'name' }).save()).id,
          companyId: (await new CompanyEntity({ name: 'name' }).save()).id,
          deliveryCharge: 3000,
          deliveryFreeOver: 30000,
          deliveryType: 'COUNT_FREE',
          description: 'description',
          img: 'img.jpg',
          isSale: 0,
          name: 'name',
        });

        /**
         * 상품이 있다면 유저 쪽에서 조회 API를 했을 때 나와야 한다.
         */
        const productList = await productController.getProductList({
          limit: 1,
          page: 1,
          search: null,
          sellerId: decoded.id,
          categoryId: null,
        });

        expect(productList?.length).toBe(1);
      });
    });
  });
});