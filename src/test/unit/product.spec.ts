import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ProductController } from 'src/controllers/product.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { CompanyEntity } from 'src/entities/company.entity';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { SellerEntity } from 'src/entities/seller.entity';
import { GetProductListResponse } from 'src/interfaces/get-product-list-response.interface';
import { GetProductResponse } from 'src/interfaces/get-product-response.interface';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CompanyRepository } from 'src/repositories/company.repository';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/products.required.option.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { ProductService } from 'src/services/product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let repository: ProductRepository;

  let sellerRepository: SellerRepository;
  let categoryRepository: CategoryRepository;
  let companyRepository: CompanyRepository;
  let productRequiredOptionRepository: ProductRequiredOptionRepository;
  let productOptionRepository: ProductOptionRepository;

  const testNum = 2; // 판매자, 카테고리, 회사의 수

  /**
   *  상품, 필수옵션, 선택옵션 테스트 데이터 생성 수
   *  무조건 1 이상이어야 합니다.
   */

  const testMinCount = 5;
  const MinPrice = 100;

  let sellers: SellerEntity[];
  let categories: CategoryEntity[];
  let companies: CompanyEntity[];
  let products: ProductEntity[] = [];
  let productReqiredOptions: ProductRequiredOptionEntity[] = [];
  let productOptions: ProductOptionEntity[] = [];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<ProductService>(ProductService);
    controller = module.get<ProductController>(ProductController);
    repository = module.get<ProductRepository>(ProductRepository);

    sellerRepository = module.get<SellerRepository>(SellerRepository);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
    productRequiredOptionRepository = module.get<ProductRequiredOptionRepository>(ProductRequiredOptionRepository);
    productOptionRepository = module.get<ProductOptionRepository>(ProductOptionRepository);

    /**
     * 조회에 사용할 충분한 상품은 이미 등록되어 있어야 한다.
     * 생성되는 상품은
     * testnum^3 * productcount개 이다.
     */

    /**
     * 판매자 계정을 생성한다.
     */

    sellers = new Array(testNum).fill(0).map(
      (el, idx) =>
        new SellerEntity({
          email: `${idx}`,
          hashedPassword: `${idx}`,
          name: `${idx}`,
          businessNumber: `${idx}`,
          phone: `${idx}`,
        }),
    );
    await sellerRepository.save(sellers);

    /**
     * 카테고리를 생성한다.
     */

    categories = new Array(testNum).fill(0).map(
      (el, idx) =>
        new CategoryEntity({
          name: `${idx}`,
        }),
    );
    await categoryRepository.save(categories);

    /**
     * 회사를 생성한다.
     */

    companies = new Array(testNum).fill(0).map(
      (el, idx) =>
        new CompanyEntity({
          name: `${idx}`,
        }),
    );
    await companyRepository.save(companies);

    /**
     * 판매자별 카테고리별 회사별 상품을 productcount개씩 생성한다.
     */

    sellers.forEach((s) => {
      let sellerId = s.id;
      categories.forEach((ca) => {
        let categoryId = ca.id;
        companies.forEach((co) => {
          let companyId = co.id;
          for (let i = 0; i < testMinCount; i++) {
            products.push(
              new ProductEntity({
                sellerId,
                categoryId,
                companyId,
                isSale: true,
                name: `${String.fromCharCode(i + 65)}_${sellerId}_${categoryId}_${companyId}`,
                deliveryType: 'FREE',
                deliveryCharge: 3000,
                img: 'test.img',
              }),
            );
          }
        });
      });
    });
    await repository.save(products);

    /**
     * 상품당 필수 옵션을 productMinCount개씩 생성한다.
     */
    products.forEach((p) => {
      for (let i = 0; i < testMinCount; i++) {
        productReqiredOptions.push(
          new ProductRequiredOptionEntity({
            productId: p.id,
            name: `test_${p.id}_${i}`,
            price: i * 1000 + 100,
            isSale: true,
          }),
        );
      }
    });
    await productRequiredOptionRepository.save(productReqiredOptions);

    /**
     * 상품당 선택 옵션을 productMinCount개씩 생성한다.
     */
    products.forEach((p) => {
      for (let i = 0; i < testMinCount; i++) {
        productOptions.push(
          new ProductOptionEntity({
            productId: p.id,
            name: `test_${p.id}_${i}`,
            price: i * 1000 + MinPrice,
            isSale: true,
          }),
        );
      }
    });
    await productOptionRepository.save(productOptions);
  });

  /**
   * 테스트 후 데이터는 삭제한다.
   */
  afterAll(async () => {
    await productOptionRepository.remove(productOptions);
    await productRequiredOptionRepository.remove(productReqiredOptions);
    await repository.remove(products);
    await sellerRepository.remove(sellers);
    await categoryRepository.remove(categories);
    await companyRepository.remove(companies);
  });

  /**
   * @todo
   * 회사가 존재한다는 전제로 테스트 한다.
   
   * 상품 테스트 코드는 회사에 독립적으로 진행될 수 있어야 한다.
   * 허가 칼럼 추가
   */

  /**
   * GET products?page=1&limit=15&category=&sellerId=&
   *
   * @todo 엔드포인트를 2개 가질 수도 있다.
   * GET categories/:categoryId/products?page=1&limit=15 ...
   *
   */
  describe('buyer의 상품 조회 로직을 테스트 한다.', () => {
    it('상품이 페이지 네이션으로 1 페이지가 조회 되는지 확인한다.', async () => {
      /**
       * 등록된 최소한의 상품을 DB에서 페이지네이션으로 가져올 수 있어야한다.
       */
      const res = await controller.getProductList({
        page: 1,
        limit: testMinCount,
      });
      expect(res.data.list.length).toBe(testMinCount);
    });

    it('상품에 어떤 페이지도 주지 않을 경우 첫번째 페이지가 나와야 한다.', async () => {
      const isPage = await controller.getProductList({ page: 1 });
      const notPage = await controller.getProductList({});

      /**
       * 조회한 상품의 id 값들 추출
       */
      const isPageIds = isPage.data.list.map((el) => el.id);
      const notPageIds = notPage.data.list.map((el) => el.id);

      expect(isPageIds.every((el, idx) => el === notPageIds.at(idx))).toBe(true);
    });

    it('category 별 조회가 가능해야 한다.', async () => {
      const categoryIds = categories.map((el) => el.id);
      const testCategoryId = categoryIds[0];

      const res: GetProductListResponse = await controller.getProductList({
        page: 1,
        limit: testMinCount,
        categoryId: testCategoryId,
      });

      expect(res.data.list.every((el) => el.categoryId === testCategoryId)).toBe(true);

      /**
       * 우연의 일치로 하필 조회한 데이터가 전부 카테고리 아이디와 일치했을 가능성을 배제하기 위해
       * 서비스로 등록된 상품 개수 이상을 체크한다.
       */
      const resByService = await service.getProductList({
        page: 1,
        limit: 300,
        categoryId: testCategoryId,
      });

      expect(resByService.list.every((el) => el.categoryId === testCategoryId)).toBe(true);
    });

    /**
     * 대표 가격은 입력한 옵션 중 자동으로 최솟값이 들어가야 한다.
     *  - 여기서 말하는 입력한 옵션이란, 품절과 판매가 중단된, 그리고 삭제된 옵션을 모두 제외한 후의 최솟값이다.
     *  - 즉, '반드시 현재 구매 가능한 상태' 중의 최솟값을 말한다.
     */

    it('상품리스트 조회시 대표가격이 노출된다.', async () => {
      const res = await controller.getProductList({
        page: 1,
        limit: testMinCount,
      });

      expect(res.data.list.every((el) => el['minimumPrice'] === MinPrice)).toBe(true);
    });

    /**
     * 상품의 이름은 product에 name 칼럼에 저장한다.
     *
     * 유저가 입력한 search으로 name 칼럼을 조회한다.
     * search 문자열이 name에 포함되어 있으면 검색결과로 조회되고 포함되지 않는다면 조회되지 않는다.
     *
     */
    it('상품의 name으로 검색할 수 있다.', async () => {
      const ProductNames = products.map((el) => el.name);
      const testName = ProductNames.at(0)?.charAt(0);
      const res = await controller.getProductList({
        page: 1,
        limit: 300,
        search: testName,
      });

      expect(res.data.list.every((el) => el.name.includes(testName as string))).toBe(true);
    });

    /**
     * 이미지는 등록 순으로 정렬되어야 하며, 리스트에서는 이미지가 1장이면 되기 때문에 썸네일로 제공되어야 한다.
     *    - 이미지는 가장 먼저 등록된 것을 썸네일로 삼는다.
     *
     * @todo 이미지 컬럼을 별도의 테이블로 분리
     */
    it.todo('상품 조회시 썸네일이 노출되어야 한다.');

    /**
     * @todo 상품에 대한 리뷰시스템를 추가한다.
     * 리뷰 테이블을 별도로 두고 아래 정보는 조인해서 조회한다.
     * 한 명의 유저가 기록할 때마다 수정하려면 너무 많은 연산이 필요하기 떄문에 미리 저장해둔다.
     *
     * 상품에 대한 리뷰 별점을 의미한다.
     * rating : number;
     *
     * 상품에 대한 리뷰 작성수를 의미한다.
     * reviewCount : number;
     */
    it.todo('상품 조회시 별점이 노출되어야 한다.');
    it.todo('상품 조회시 리뷰수가 노출되어야 한다.');
  });

  describe('typeorm 조인 쿼리를 검증한다.', () => {
    it.skip('상품 조회시 필수 옵션에 대한 DB 조회를 할 수 있어야 한다.', async () => {
      const ProductIds = products.map((el) => el.id);
      const testId = ProductIds[0];

      const data = await repository
        .createQueryBuilder('product')
        .withDeleted()
        .innerJoinAndSelect('product.productRequiredOptions', 'productRequiredOption')
        .where('product.id = :id', { id: testId })
        .andWhere('product.isSale = :isSale', { isSale: true })
        .andWhere('productRequiredOption.isSale = :isSale', { isSale: true })
        .getOne();

      expect(data !== null).toBe(true);
      if (data != null) {
        expect(data.id).toBe(testId);
        expect(data.isSale).toBe(true);
        expect(data['productRequiredOptions'].every((el) => el.productId === testId)).toBe(true);
      }
    });
  });

  /**
   * GET products/:id
   */
  describe('상품의 상세 페이지 조회를 검증한다.', () => {
    /**
     * 상품의 이름을 포함한 기본적인 정보 전부와
     * 필수옵션, 선택옵션을 가져온다.
     *
     * 이렇게 옵션을 미리 가져 오는 이유는 상품 조회, 페이지 이동, 옵션 조회 등 API가 나뉘는 것을 방지하기 위함이다.
     * 이렇게 한 번의 요청으로 가져온 후 이후 필요한 데이터를 추가적인 API로 가져오는 게 성능 상 유리하다.
     */
    it.skip('상품의 상세 페이지를 조회할 수 있어야한다.', async () => {
      const ProductIds = products.map((el) => el.id);
      const testId = ProductIds[0];

      const res = await controller.getProduct(testId);
      const { product, productRequiredOptions, productOptions } = res.data as GetProductResponse;

      /**
       * 조회된 상품 id와 필수옵션, 선택옵션의 productId 값이 testId와 같아야 한다.
       */
      expect(product.id === testId).toBe(true);
      expect(productRequiredOptions.every((el) => el.productId === testId)).toBe(true);
      expect(productOptions.every((el) => el.productId === testId)).toBe(true);
    });

    /**
     * 추천 상품의 기준은 편의 상 동일 카테고리를 기준으로 한다.
     */
    it.todo('상품 상세 페이지 조회 시에는 상품의 추천 상품 10개가 함께 보여져야 한다.');
  });

  describe('GET products/:id/options?required=', () => {
    /**
     * 상품의 옵션 조회 시 쿼리로 받은 requried true, false를 통해
     * 선택 옵션과 그렇지 않은 경우를 구분할 수 있어야 한다.
     *
     * 당연히 페이지네이션이어야 하며, 1페이지가 default로 조회되어야 한다.
     * 상품의 최초 조회 시 상품의 옵션들이 조회되기 때문에 서비스 로직은 재사용될 수 있어야 한다.
     */
    it('상품의 옵션을 페이지네이션으로 서비스 단에서 조회할 수 있다.', async () => {
      const productIds = products.map((el) => el.id);
      const testProductId = productIds[0];

      const resByServiceIsRequired = await service.getProductOptions(
        testProductId,
        { isRequire: true },
        { page: 0, limit: testMinCount },
      );

      const resByServiceIsNotRequired = await service.getProductOptions(
        testProductId,
        { isRequire: false },
        { page: 0, limit: testMinCount },
      );
      /**
       * 페이지네이션으로 조회된 상품 필수/선택옵션의 id는 testId와 같아야 한다.
       */
      expect(resByServiceIsRequired.list.every((el) => el.productId === testProductId)).toBe(true);
      expect(resByServiceIsNotRequired.list.every((el) => el.productId === testProductId)).toBe(true);
      /**
       * 해당 테스트에서 페이지네이션으로 조회된 결과 배열의 length는 testMinCount과 같아야한다.
       */
      expect(resByServiceIsRequired.list.length === testMinCount).toBe(true);
      expect(resByServiceIsNotRequired.list.length === testMinCount).toBe(true);
    });

    it.only('상품의 옵션을 페이지네이션으로 조회할 수 있다.', async () => {
      const productIds = products.map((el) => el.id);
      const testProductId = productIds[0];

      const resByControllerIsRequired = await controller.getProductOptions(
        testProductId,
        { isRequire: true },
        { page: 0, limit: testMinCount },
      );

      const resByControllerIsNotRequired = await controller.getProductOptions(
        testProductId,
        { isRequire: false },
        { page: 0, limit: testMinCount },
      );
      /**
       * 페이지네이션으로 조회된 상품 필수/선택옵션의 id는 testId와 같아야 한다.
       */
      expect(resByControllerIsRequired.data.list.every((el) => el.productId === testProductId)).toBe(true);
      expect(resByControllerIsNotRequired.data.list.every((el) => el.productId === testProductId)).toBe(true);
      /**
       * 해당 테스트에서 페이지네이션으로 조회된 결과 배열의 length는 testMinCount과 같아야한다.
       */
      expect(resByControllerIsRequired.data.list.length === testMinCount).toBe(true);
      expect(resByControllerIsNotRequired.data.list.length === testMinCount).toBe(true);

      /**
       * 페이지네이션 입력을 주지 않아도
       * 자동으로 1 페이지의 데이터를 조회할 수 있어야한다.
       */
      const resByControllerNoPageNolimit = await controller.getProductOptions(testProductId, { isRequire: true }, {});
      const resByControllerOnePage = await controller.getProductOptions(
        testProductId,
        { isRequire: true },
        { page: 1 },
      );
      const NoPageNoLimitIds = resByControllerNoPageNolimit.data.list.map((el) => el.id);
      const OnePageIds = resByControllerOnePage.data.list.map((el) => el.id);

      expect(NoPageNoLimitIds.every((el, i) => el === OnePageIds.at(i))).toBe(true);
    });

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
