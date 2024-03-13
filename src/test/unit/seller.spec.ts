import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { SellerService } from 'src/services/seller.service';

describe('Seller Controller', () => {
  let controller: SellerController;
  let service: SellerService;
  let repository: SellerRepository;

  let authController: AuthController;
  let testId: number | null = null;

  let productBundleRepository: ProductBundleRepository;
  let productRepository: ProductRepository;
  let productRequiredRepository: ProductRequiredOptionRepository;
  let productOptionRepository: ProductOptionRepository;

  /**
   * 구매자 사이드
   */

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    service = module.get<SellerService>(SellerService);
    repository = module.get<SellerRepository>(SellerRepository);

    authController = module.get<AuthController>(AuthController);

    productBundleRepository = module.get<ProductBundleRepository>(ProductBundleRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
    productRequiredRepository = module.get<ProductRequiredOptionRepository>(ProductRequiredOptionRepository);
    productOptionRepository = module.get<ProductOptionRepository>(ProductOptionRepository);

    /**
     * seller 회원이어야 사용 가능하다.
     * 테스트 seller를 생성한 후 id를 추출해 사용한다.
     */
    const testSeller: CreateSellerDto = {
      email: 'myemail@gmail.com',
      password: 'mypassword1!',
      name: 'myname',
      phone: '01012341234',
      businessNumber: '12341234',
    };

    await authController.sellerSignUp(testSeller);
    const { id, ...rest } = await repository.findByEmail(testSeller.email);
    testId = id;
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(authController).toBeDefined();
  });

  it('seller 회원이어야 사용가능 하다.', () => {
    expect(testId).toBeDefined();
    expect(testId !== null).toBe(true);
  });

  describe('POST', () => {
    /**
     * 1. 상품 생성 허가 기능이 추가될 경우
     *
     * 상품 생성 허가를 구현하기 위해서는 별도의 칼럼이 필요하다.
     * - 허가 받은 날짜를 명시하는 컬럼을 추가해 구현
     * - 허가 취소를 구현할 경우, 허가가 삭제된 날짜를 명시하는 컬럼 또한 필요할 수 있다.
     * - 필요 시 로그로 관리하기 위해 날짜 칼럼이 아니라 `허가 로그 테이블`을 만든다.
     *
     * product 생성 시 해당 seller가 허가를 받았는지 확인한다.
     * 만약 아직 허가 받지 않은 회사라면, product을 등록하지 않고 허가를 받으라는 에러 메시지를 출력한다.
     */
    it.todo('상품을 생성할 때에는 우리 측의 허가를 받은 회사만 생성 가능하다.');

    /**
     * 1-1. 로그 테이블 관리의 장점
     * 허가/거절 이력을 관리하고 싶을때 유용하다.
     */
    it.todo('허가 받은지 1년이 지난 경우라면 어떻게 해야 하는가?');

    describe('seller는 상품묶음(bundle)을 생성할 수 있다.', () => {
      const testProductBundle: CreateProductBundleDto = {
        name: 'Test Bundle name',
        chargeStandard: 'MIN',
      };

      it('상품 묶음이 생성 되었다면 DB에서 조회할 수 있어야 한다.', async () => {
        const { data } = await controller.createProductBundle(testId as number, testProductBundle);
        const savedProductBundle = await productBundleRepository.getProductBundle(data.id);
        expect(savedProductBundle).not.toBe(null);
      });
    });

    describe('seller는 상품을 생성할 수 있다.', () => {
      const testProduct: CreateProductDto = {
        bundleId: 1,
        categoryId: 1,
        companyId: 1,
        isSale: true,
        name: 'test product',
        description: '테스트 상품 입니다!',
        deliveryType: 'FREE',
        deliveryFreeOver: null,
        deliveryCharge: 0,
        img: 'test.img',
      };

      it('상품이 생성 되었다면 DB에서 조회할 수 있어야 한다.', async () => {
        const { data } = await controller.createProduct(testId as number, testProduct);
        const savedProduct = await productRepository.getProduct(data.id);

        expect(savedProduct).not.toBe(null);
      });

      /**
       * 로그인과 무관하게 동작해야 한다.
       * 이 부분은 추후 구매자 플로우에서 다시 증명 한다.
       */
      it.skip('생성된 상품을 buyer 조회할 수 있어야 한다.', () => {});
    });
  });

  describe('seller는 등록된 상품에 대하여 필수 옵션/선택옵션을 추가할 수 있다.', () => {
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
    const testProduct: CreateProductDto = {
      bundleId: 1,
      categoryId: 1,
      companyId: 1,
      isSale: true,
      name: 'test product',
      description: '테스트 상품 입니다!',
      deliveryType: 'FREE',
      deliveryFreeOver: null,
      deliveryCharge: 0,
      img: 'test.img',
    };

    it('필수 옵션이 추가되면 그 id를 DB에서 조회할 수 있어야 한다.', async () => {
      const { data } = await controller.createProduct(testId as number, testProduct);
      const savedProduct = await productRepository.getProduct(data.id);
      expect(savedProduct).not.toBe(null);
      expect(savedProduct?.sellerId).toBe(testId);

      if (savedProduct) {
        const { data } = await controller.createProductOptions(
          testId as number,
          savedProduct.id,
          { isRequire: true },
          {
            name: 'test options name',
            price: 10000,
            isSale: true,
          },
        );
        const requirdOption = await productRequiredRepository.getRequiredOption(data.id);
        expect(requirdOption).not.toBe(null);
      }
    });

    it('선택 옵션이 추가되면 그 id를 DB에서 조회할 수 있어야 한다.', async () => {
      const { data } = await controller.createProduct(testId as number, testProduct);
      const savedProduct = await productRepository.getProduct(data.id);
      expect(savedProduct).not.toBe(null);
      expect(savedProduct?.sellerId).toBe(testId);

      if (savedProduct) {
        const { data } = await controller.createProductOptions(
          testId as number,
          savedProduct.id,
          { isRequire: false },
          {
            name: 'test options name',
            price: 10000,
            isSale: true,
          },
        );
        const option = await productOptionRepository.getOption(data.id);
        expect(option).not.toBe(null);
      }
    });

    it('해당 상품을 생성한 판매자가 아닐 경우 권한 에러를 던져야 한다.', async () => {
      const { data } = await controller.createProduct(testId as number, testProduct);
      const savedProduct = await productRepository.getProduct(data.id);
      expect(savedProduct).not.toBe(null);

      if (savedProduct) {
        try {
          await controller.createProductOptions(
            (testId as number) + 1,
            savedProduct.id,
            { isRequire: true },
            {
              name: 'test required options name',
              price: 10000,
              isSale: true,
            },
          );
          expect(1).toBe('판매자가 다른 데도 불구하고 에러가 나지 않은 케이스');
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
        }
      }
    });
  });
});
