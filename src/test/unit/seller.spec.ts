import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { SellerController } from 'src/controllers/seller.controller';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { CreateSellerDto } from 'src/dtos/create-seller.dto';
import { ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { CategoryService } from 'src/services/category.service';
import { CompanyService } from 'src/services/company.service';
import { ProductService } from 'src/services/product.service';
import { SellerService } from 'src/services/seller.service';
import { isEqual } from 'src/util/functions/is-equal.function';

describe('Seller Controller', () => {
  let controller: SellerController;
  let service: SellerService;

  let productService: ProductService;
  let companyService: CompanyService;
  let categoryService: CategoryService;

  let authController: AuthController;
  let testId: number;
  let testBundleId: number;
  let testCategoryId: number;
  let testCompanyId: number;

  let testProduct: CreateProductDto;

  /**
   * 구매자 사이드
   */

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    service = module.get<SellerService>(SellerService);

    productService = module.get<ProductService>(ProductService);
    companyService = module.get<CompanyService>(CompanyService);
    categoryService = module.get<CategoryService>(CategoryService);

    authController = module.get<AuthController>(AuthController);

    /**
     * seller 회원이어야 사용 가능하다.
     * 임의의 회원을 생성하여 사용한다.
     */
    const testSeller: CreateSellerDto = {
      email: `${v4()}`.slice(0, 100) + '@gmail.com',
      password: 'mypassword1!',
      name: 'myname',
      phone: '01012341234',
      businessNumber: '12341234',
    };

    const seller = await authController.sellerSignUp(testSeller);
    testId = seller.data.id;

    /**
     * 상품 묶음을 생성합니다.
     */
    const bundle = await service.createProductBundle(testId, { name: v4(), chargeStandard: 'MIN' });
    testBundleId = bundle.id;

    /**
     * 카테고리와 회사를 생성한다.
     */
    const company = await companyService.createCompany(testId, { name: v4() });
    testCompanyId = company.id;

    const category = await categoryService.createCategory({ name: v4() });
    testCategoryId = category.id;

    testProduct = {
      bundleId: testBundleId,
      categoryId: testCategoryId,
      companyId: testCompanyId,
      isSale: true,
      name: v4().slice(0, 10),
      description: v4().slice(0, 10),
      deliveryType: 'FREE',
      deliveryFreeOver: null,
      deliveryCharge: 0,
      img: v4().slice(0, 10),
    };
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(authController).toBeDefined();
    expect(productService).toBeDefined();
    expect(companyService).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('테스트 계정은 판매자로 등록되어 있어야 한다.', () => {
    expect(testId).toBeDefined();
    expect(testId).not.toBe(null);
  });

  it('테스트 상품 묶음, 카테고리, 회사가 정의되어야 한다.', () => {
    expect(testBundleId).toBeDefined();
    expect(testBundleId).not.toBe(null);
    expect(testCompanyId).toBeDefined();
    expect(testCompanyId).not.toBe(null);
    expect(testCategoryId).toBeDefined();
    expect(testCategoryId).not.toBe(null);
  });

  describe('seller는 상품묶음(bundle)을 생성할 수 있다.', () => {
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

    const testProductBundle: CreateProductBundleDto = {
      name: 'Test Bundle name',
      chargeStandard: 'MIN',
    };

    it('상품 묶음이 생성 되었다면 DB에서 조회할 수 있어야 한다.', async () => {
      const { data } = await controller.createProductBundle(testId as number, testProductBundle);
      const savedProductBundle = await service.getProductBundle(data.id);

      expect(savedProductBundle).toBeDefined();
      expect(savedProductBundle.id).toBeDefined();
      expect(savedProductBundle.id).not.toBe(null);

      expect(savedProductBundle.sellerId).toBe(testId);
      expect(savedProductBundle.name).toBe(testProductBundle.name);
      expect(savedProductBundle.chargeStandard).toBe(testProductBundle.chargeStandard);
    });
  });

  describe('seller는 상품을 생성할 수 있다.', () => {
    it('상품이 생성 되었다면 DB에서 조회할 수 있어야 한다.', async () => {
      const { data } = await controller.createProduct(testId as number, testProduct);
      const { id: savedId, sellerId: savedSellerId, ...savedProduct } = await productService.getProductById(data.id);

      expect(savedId).toBe(data.id);
      expect(savedSellerId).toBe(testId);
      expect(isEqual(testProduct, savedProduct)).toBe(true);
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

    it('필수 옵션이 추가되면 DB에서 조회할 수 있어야 한다.', async () => {
      const { data: savedProduct } = await controller.createProduct(testId as number, testProduct);

      expect(savedProduct).not.toBe(null);
      expect(savedProduct.sellerId).toBe(testId);

      const { data: testRequiredOption } = await controller.createProductOptions(
        testId as number,
        savedProduct.id,
        { isRequire: true },
        {
          name: 'test options name',
          price: 10000,
          isSale: true,
        },
      );
      const savedRequiredOption = await productService.getProductRequiredOptionById(testRequiredOption.id);

      expect(isEqual(testRequiredOption, savedRequiredOption)).toBe(true);
    });

    it('선택 옵션이 추가되면 DB에서 조회할 수 있어야 한다.', async () => {
      const { data: savedProduct } = await controller.createProduct(testId as number, testProduct);
      expect(savedProduct).not.toBe(null);
      expect(savedProduct?.sellerId).toBe(testId);

      const { data: testOption } = await controller.createProductOptions(
        testId as number,
        savedProduct.id,
        { isRequire: false },
        {
          name: 'test options name',
          price: 10000,
          isSale: true,
        },
      );
      const savedOption = await productService.getProductOptionById(testOption.id);

      expect(isEqual(testOption, savedOption)).toBe(true);
    });

    it('해당 상품을 생성한 판매자가 아닐 경우 권한 에러를 던져야 한다.', async () => {
      const { data } = await controller.createProduct(testId as number, testProduct);
      const savedProduct = await productService.getProductById(data.id);
      expect(savedProduct).not.toBe(null);

      try {
        await controller.createProductOptions(
          (testId as number) + 1, // 잘못된 id 삽입
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
        expect(err).toBeInstanceOf(ProductUnauthrizedException);
      }
    });
  });

  describe('seller는 등록한 상품묶음을 조회할 수 있다.', () => {
    it('seller는 등록된 상품 묶음을 페이지네이션으로 조회할 수 있다.', async () => {
      /** 최소 한 개의 데이터 삽입 */
      await controller.createProductBundle(testId, { name: v4().slice(0, 10), chargeStandard: 'MAX' });
      const { data } = await controller.getProductBundles(testId, {});

      const isAllSellerIdTrue = data.every((d) => d.sellerId === testId);
      expect(isAllSellerIdTrue).toBe(true);
    });
  });

  describe('seller는 등록한 상품을 조회할 수 있다.', () => {
    /**
     * seller는 본인이 등록한 상품을 조회할 수 있다.
     * 상품 묶음별, 카테고리별, 회사별 등 정보에 따라 조회가 가능해야 한다.
     */
    it('seller는 상품 묶음 별로 상품을 조회할 수 있다.', async () => {
      const testBundle = await service.createProductBundle(testId, {
        name: v4().slice(0, 10),
        chargeStandard: 'MAX',
      });

      const { bundleId, ...restOption } = testProduct;
      await Promise.all(
        new Array(10).fill(0).map(() => {
          return controller.createProduct(testId, { ...restOption, bundleId: testBundle.id });
        }),
      );

      const { data } = await controller.getProducts(testId, { bundleId: testBundle.id });
      const isAllProductBudleTrue = data.every((d) => d.bundleId === testBundle.id);

      expect(data.length > 0).toBe(true);
      expect(isAllProductBudleTrue).toBe(true);
    });

    it('상품 묶음이 없는 경우(null일 경우)도 조회가 가능해야 한다.', async () => {
      const { bundleId, ...restOption } = testProduct;
      await Promise.all(
        new Array(10).fill(0).map(() => {
          return controller.createProduct(testId, { ...restOption, bundleId: null });
        }),
      );

      const { data } = await controller.getProducts(testId, { bundleId: null });
      const isAllProductBudleTrue = data.every((d) => d.bundleId === null);

      expect(data.length > 0).toBe(true);
      expect(isAllProductBudleTrue).toBe(true);
    });

    it('상품이 판매되는 상태가 아닌 경우(isSale = false)에도 조회가 가능해야 한다.', async () => {
      const { isSale, ...restOption } = testProduct;
      await Promise.all(
        new Array(10).fill(0).map(() => {
          return controller.createProduct(testId, { ...restOption, isSale: false });
        }),
      );

      const { data } = await controller.getProducts(testId, { isSale: false });
      const isAllProductSaleTrue = data.every((d) => d.isSale === false);

      expect(data.length > 0).toBe(true);
      expect(isAllProductSaleTrue).toBe(true);
    });
  });

  describe('seller는 등록한 필수 상품 옵션을 조회할 수 있다.', () => {
    it.skip('seller는 등록된 상품 필수 옵션을 페이지네이션으로 조회할 수 있다.', async () => {
      /**
       * 새로운 상품에 대한 새로운 필수 옵션을 10개를 생성하고, 페이지네이션으로 5개씩 조회하는 상황을 테스트 합니다.
       */

      const { data: product } = await controller.createProduct(testId, testProduct);

      await Promise.all(
        new Array(10).fill(0).map(() => {
          return controller.createProductOptions(
            testId,
            product.id,
            { isRequire: true },
            { name: v4().slice(0, 10), isSale: true, price: 1000 },
          );
        }),
      );

      const { data, meta } = await controller.getProductOptions(testId, product.id, { isRequire: true }, { limit: 5 });

      const isTrueProduct = data.every((d) => d.productId === product.id);
      expect(isTrueProduct).toBe(true);

      expect(data.length).toBe(5);
      expect(meta.take).toBe(5);
      expect(meta.page).toBe(2);
    });

    it.todo('seller는 판매중이 아닌(isSale = false) 상품 필수 옵션도 조회할 수 있다.');

    it.todo('seller는 특정 가격의 상품 필수 옵션을 조회할 수 있다.');

    it.todo('seller는 가격 오름차순으로 상품 필수 옵션을 조회할 수 있다.');

    it.todo('seller는 가격 내림차순으로 상품 필수 옵션을 조회할 수 있다.');

    it.todo('seller는 해당 키워드를 가진 상품 필수 옵션을 조회할 수 있다.');
  });

  describe('seller는 등록된 선택 상품의 정보를 조회할 수 있다.', () => {
    it.todo('seller는 등록된 상품 선택 옵션을 조회할 수 있다.');
  });

  describe('seller는 등록된 상품의 정보를 수정할 수 있다.', () => {
    it.todo('상품의 데이터를 수정할 수 있다.');
  });
});
