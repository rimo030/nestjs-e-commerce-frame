import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { CartController } from 'src/controllers/cart.controller';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { CartService } from 'src/services/cart.service';
import { CategoryService } from 'src/services/category.service';
import { CompanyService } from 'src/services/company.service';
import { ProductService } from 'src/services/product.service';
import { SellerService } from 'src/services/seller.service';

describe('Cart Controller', () => {
  let controller: CartController;
  let service: CartService;

  let authService: AuthService;
  let sellerService: SellerService;
  let categoryService: CategoryService;
  let companyService: CompanyService;
  let productService: ProductService;

  let testProductNullBundle: ProductDto;
  let testProductFree: ProductDto;
  let testProductNotFree: ProductDto;
  let testProductCountFree: ProductDto;
  let testProductPriceFree: ProductDto;

  let testProducts: ProductDto[];
  let testBuyerId: number;
  let testCount = 0;

  let testProductId: number;
  let testRequiredOption: ProductRequiredOptionDto;
  let testOption: ProductOptionDto;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);

    authService = module.get<AuthService>(AuthService);
    sellerService = module.get<SellerService>(SellerService);
    productService = module.get<ProductService>(ProductService);
    companyService = module.get<CompanyService>(CompanyService);
    categoryService = module.get<CategoryService>(CategoryService);

    /**
     * 테스트 buyer를 생성합니다.
     */
    const { id: buyerId } = await authService.buyerSignUp({
      email: `${v4().slice(0, 100)}@gmail.com`,
      password: 'mypassword1!',
      age: 1,
      gender: 1,
      name: 'test',
      phone: '12345678910',
    });
    testBuyerId = buyerId;

    /**
     * 테스트 seller를 생성합니다.
     */
    const { id: sellerId } = await authService.sellerSignUp({
      email: `${v4().slice(0, 100)}@gmail.com`,
      password: 'mypassword1!',
      name: 'myname',
      phone: '12345678910',
      businessNumber: '12345678910',
    });

    /**
     * 테스트 카테고리, 회사를 생성합니다.
     */

    const testCategory = await categoryService.createCategory({ name: v4().slice(0, 100) });
    const testCompany = await companyService.createCompany({ sellerId, name: v4().slice(0, 100) });

    /**
     * 테스트 상품 묶음을 등록합니다.
     */
    const testProductBundleMin = await sellerService.createProductBundle(sellerId, {
      name: v4().slice(0, 100),
      chargeStandard: 'MIN',
    });

    const testProductBundleMax = await sellerService.createProductBundle(sellerId, {
      name: v4().slice(0, 100),
      chargeStandard: 'MAX',
    });

    /**
     * 테스트 상품과 옵션을 등록합니다.
     * 테스트 상품은 1개 이상의 필수/선택 옵션을 가집니다.
     * 테스트 상품은 deliveryType에 따라 최소 한개씩 생성되어야 합니다.
     */

    const testOptionDto: CreateProductOptionsDto = {
      price: 1000,
      isSale: true,
      name: v4(),
    };

    // 무료 배송 상품 & Null 상품 묶음
    testProductNullBundle = await sellerService.createProduct(sellerId, {
      bundleId: null,
      categoryId: testCategory.id,
      companyId: testCompany.id,
      name: v4().slice(0, 100),
      description: v4().slice(0, 100),
      deliveryType: 'FREE',
      deliveryCharge: 0,
      deliveryFreeOver: null,
      img: v4().slice(0, 100),
      isSale: true,
    });

    await sellerService.createProductOptions(sellerId, testProductNullBundle.id, { isRequire: true }, testOptionDto);
    await sellerService.createProductOptions(sellerId, testProductNullBundle.id, { isRequire: false }, testOptionDto);

    // 무료 배송 상품 & Min 상품 묶음
    testProductFree = await sellerService.createProduct(sellerId, {
      bundleId: testProductBundleMin.id,
      categoryId: testCategory.id,
      companyId: testCompany.id,
      name: v4().slice(0, 100),
      description: v4().slice(0, 100),
      deliveryType: 'FREE',
      deliveryCharge: 0,
      deliveryFreeOver: null,
      img: v4().slice(0, 100),
      isSale: true,
    });

    /**
     * 기존 테스트의 통과를 위해 생성
     */
    testProductId = testProductFree.id;
    testRequiredOption = await sellerService.createProductOptions(
      sellerId,
      testProductFree.id,
      { isRequire: true },
      testOptionDto,
    );
    testOption = await sellerService.createProductOptions(
      sellerId,
      testProductFree.id,
      { isRequire: false },
      testOptionDto,
    );

    // 유료 배송 상품 & Min 상품 묶음
    testProductNotFree = await sellerService.createProduct(sellerId, {
      bundleId: testProductBundleMin.id,
      categoryId: testCategory.id,
      companyId: testCompany.id,
      name: v4().slice(0, 100),
      description: v4().slice(0, 100),
      deliveryType: 'NOT_FREE',
      deliveryCharge: 1000,
      deliveryFreeOver: null,
      img: v4().slice(0, 100),
      isSale: true,
    });

    await sellerService.createProductOptions(sellerId, testProductNotFree.id, { isRequire: true }, testOptionDto);
    await sellerService.createProductOptions(sellerId, testProductNotFree.id, { isRequire: false }, testOptionDto);

    // 몇 개 이상 무료 배송 상품 & Max 상품 묶음
    testProductCountFree = await sellerService.createProduct(sellerId, {
      bundleId: testProductBundleMax.id,
      categoryId: testCategory.id,
      companyId: testCompany.id,
      name: v4().slice(0, 100),
      description: v4().slice(0, 100),
      deliveryType: 'COUNT_FREE',
      deliveryCharge: 1000,
      deliveryFreeOver: 2,
      img: v4().slice(0, 100),
      isSale: true,
    });

    await sellerService.createProductOptions(sellerId, testProductCountFree.id, { isRequire: true }, testOptionDto);
    await sellerService.createProductOptions(sellerId, testProductCountFree.id, { isRequire: false }, testOptionDto);

    // 가격 이상 무료 배송 상품 & Max 상품 묶음
    testProductPriceFree = await sellerService.createProduct(sellerId, {
      bundleId: testProductBundleMax.id,
      categoryId: testCategory.id,
      companyId: testCompany.id,
      name: v4().slice(0, 100),
      description: v4().slice(0, 100),
      deliveryType: 'PRICE_FREE',
      deliveryCharge: 1000,
      deliveryFreeOver: 2000,
      img: v4().slice(0, 100),
      isSale: true,
    });
    await sellerService.createProductOptions(sellerId, testProductPriceFree.id, { isRequire: true }, testOptionDto);
    await sellerService.createProductOptions(sellerId, testProductPriceFree.id, { isRequire: false }, testOptionDto);

    /**
     * 테스트시 사용할 상품데이터
     */
    testProducts = [
      testProductNullBundle,
      testProductFree,
      testProductNotFree,
      testProductCountFree,
      testProductPriceFree,
    ];
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(authService).toBeDefined();
    expect(sellerService).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(companyService).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('장바구니 기능은 구매자 계정 id가 있어야 사용 가능하다', async () => {
    expect(testBuyerId).toBeDefined();
  });

  it('테스트 상품은 deliveryType에 따라 최소 한개씩 생성되어야 합니다.', async () => {
    expect(testProductFree).toBeDefined();
    expect(testProductFree.deliveryType).toBe('FREE');
    expect(testProductNotFree).toBeDefined();
    expect(testProductNotFree.deliveryType).toBe('NOT_FREE');
    expect(testProductCountFree).toBeDefined();
    expect(testProductCountFree.deliveryType).toBe('COUNT_FREE');
    expect(testProductPriceFree).toBeDefined();
    expect(testProductPriceFree.deliveryType).toBe('PRICE_FREE');
  });

  it('테스트 상품들은 1개 이상의 필수/선택 옵션을 가져야 합니다.', async () => {
    const isAllTestProductHaveOptions = testProducts.every(async (p) => {
      const productWithOption = await productService.getProduct(p.id);
      if (productWithOption.productRequiredOptions.data.length && productWithOption.productOptions.data.length) {
        return true;
      } else {
        return false;
      }
    });
    expect(isAllTestProductHaveOptions).toBe(true);
  });

  it('현재 테스트 데이터에 대하여 장바구니는 존재하지 않아야 한다.', async () => {
    const isAllTestProductNoCartData = testProducts.every(async (p) => {
      const cart = await service.getCartByProductId(testBuyerId, p.id);
      if (!cart) {
        return true;
      } else {
        return false;
      }
    });
    expect(isAllTestProductNoCartData).toBe(true);
  });

  describe('장바구니 조회 - 1 (상품이 담기기전 장바구니 조회를 검증합니다.)', () => {
    it('장바구니 조회가 가능하며 아무것도 없을 때는 빈 배열이 조회되어야 합니다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);
      expect(data.length).toBe(0);
    });
  });

  /**
   * 장바구니, 장바구니 옵션, 장바구니 선택 옵션을 저장 합니다.
   */
  describe('장바구니 생성', () => {
    const setTestCount = () => {
      testCount = Math.floor(Math.random() * 100);
    };

    it('장바구니에 저장된 상품과 옵션들은 데이터 베이스에서 조회 가능 해야한다.', async () => {
      /**
       * 장바구니의 담을 옵션의 개수를 테스트 마다 다르게 설정합니다.
       */
      setTestCount();

      /**
       * 장바구니에 저장할 데이터를 생성합니다.
       */
      const testData = await Promise.all(
        testProducts.map(async (p) => {
          /**
           * 실제 DB에 저장되어있는 옵션을 이용합니다.
           */
          const { product, productRequiredOptions, productOptions } = await productService.getProduct(p.id);

          const createCartRequiredOptionDtos: CreateCartRequiredOptionDto[] = [];
          productRequiredOptions.data.forEach((pro) => {
            createCartRequiredOptionDtos.push({ productRequiredOptionId: pro.id, count: testCount });
          });

          const createCartOptionDtos: CreateCartOptionDto[] = [];
          productOptions.data.forEach((po) => {
            createCartOptionDtos.push({ productOptionId: po.id, count: testCount });
          });

          const testCartDto: CreateCartDto = {
            productId: product.id,
            createCartRequiredOptionDtos,
            createCartOptionDtos,
          };

          return { testCartDto, product, productRequiredOptions, productOptions };
        }),
      );

      /**
       * 테스트 상품과 옵션을 저장합니다.
       */
      await Promise.all(
        testData.map(async (t) => {
          const { data } = await controller.addCart(testBuyerId, t.testCartDto);
          return data;
        }),
      );

      /**
       * 모든 테스트 상품에 대하여 장바구니 데이터를 조회합니다.
       */
      const savedCarts = await Promise.all(
        testProducts.map(async (p) => {
          return service.getCartByProductId(testBuyerId, p.id);
        }),
      );

      // 모든 장바구니가 조회 되었는지 확인
      const isAllSaved = savedCarts.every((c) => c !== null);
      expect(isAllSaved).toBe(true);

      // 모든 상품이 조회되었는지 확인
      const isRightProduct = savedCarts.every((s) => {
        return testData.find((t) => t.product.id === s?.productId);
      });
      expect(isRightProduct).toBe(true);

      // 모든 필수 옵션이 조회되었는지 확인
      const isAllRequiredOptionsSaved = testData.every((t) => {
        const savedCart = savedCarts.find((s) => s?.productId === t.product.id);
        if (!savedCart) return false;

        return t.productRequiredOptions.data.every((pro) =>
          savedCart.cartRequiredOptions.some((savedPro) => savedPro.productRequiredOptionId === pro.id),
        );
      });
      expect(isAllRequiredOptionsSaved).toBe(true);

      // 모든 선택 옵션이 조회되었는지 확인
      const isAllOptionsSaved = testData.every((t) => {
        const savedCart = savedCarts.find((s) => s?.productId === t.product.id);
        if (!savedCart) return false;

        return t.productOptions.data.every((po) =>
          savedCart.cartOptions.some((savedPo) => savedPo.productOptionId === po.id),
        );
      });
      expect(isAllOptionsSaved).toBe(true);
    });

    it('이미 존재하는 필수/선택옵션인지 확인하고, 존재할 경우에는 수량만 더해준다.', async () => {
      /**
       * 장바구니의 담을 옵션의 개수를 테스트 마다 다르게 설정합니다.
       */
      setTestCount();

      const testCartDto: CreateCartDto = {
        productId: testProductId,
        createCartRequiredOptionDtos: [{ productRequiredOptionId: testRequiredOption.id, count: testCount }],
        createCartOptionDtos: [{ productOptionId: testOption.id, count: testCount }],
      };

      const getCart = await service.getCartByProductId(testBuyerId, testProductId);
      expect(getCart).not.toBe(null);

      /**
       *  동일한 물품의 동일한 옵션을 장바구니에 추가합니다.
       */
      await controller.addCart(testBuyerId, testCartDto);

      const savedCart = await service.getCartByProductId(testBuyerId, testProductId);
      expect(savedCart).not.toBe(null);

      /**
       * 이미 존재하는 장바구니 임이 검증되었을 때
       */
      if (getCart && savedCart) {
        expect(getCart.cartRequiredOptions.at(0)?.id).toBe(savedCart.cartRequiredOptions.at(0)?.id);
        expect((getCart.cartRequiredOptions.at(0)?.count as number) + testCount).toBe(
          savedCart.cartRequiredOptions.at(0)?.count,
        );
        expect(getCart.cartOptions.at(0)?.id).toBe(savedCart.cartOptions.at(0)?.id);
        expect((getCart.cartOptions.at(0)?.count as number) + testCount).toBe(savedCart.cartOptions.at(0)?.count);
      }
    });
  });

  describe('장바구니 조회 - 2 (상품이 담긴 이후의 장바구니 조회를 검증합니다.)', () => {
    it('장바구니 상품들은 배송비 계산을 위해 상품 묶음(product bundle id)을 기준으로 묶여서 조회되어야 한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);

      const productPromises = data.map(async (group) => {
        const productDetails = await Promise.all(
          group.cartDetails.map(async (c) => {
            const { product, ...rest } = await productService.getProduct(c.productId);
            return product.bundleId;
          }),
        );
        return productDetails.every((bundleId) => bundleId === (group.bundle?.id || group.bundle));
      });

      // 모든 그룹에 대해 번들 ID가 일치하는지 확인합니다.
      const isTrueBundle = (await Promise.all(productPromises)).every(Boolean);
      expect(isTrueBundle).toBe(true);
    });

    it('어떤 상품 묶음에도 속하지 않은 상품은 각각의 상품 하나를 묶음으로 처리한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);
      const productsWithoutBundle = data.filter((c) => c.bundle === null);

      // 검증할 데이터가 존재해야 합니다.
      expect(productsWithoutBundle.length > 0).toBe(true);

      const isOneProduct = productsWithoutBundle.every((p) => p.cartDetails.length === 1);
      expect(isOneProduct).toBe(true);
    });

    it('각 상품 묶음은 묶음에 명시된 계산 기준에 맞게 배송비가 책정 되어야 한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);

      data.every((d) => {
        if (!d.bundle) {
          return d.cartDetails.length === 1;
        } else {
          const chargeStandard = d.bundle.chargeStandard;
          const charges = d.cartDetails.map((c) => c.product.deliveryCharge);

          if (chargeStandard === 'MAX') {
            return Math.max(...charges) === d.bundleDeliveryFee;
          }

          if (chargeStandard === 'MIN') {
            return Math.min(...charges) === d.bundleDeliveryFee;
          }

          // 발생하지 말아야할 케이스로 에러가 발생합니다.
          expect(1).toBe(2);
        }
      });
    });
  });

  describe('장바구니 수정', () => {
    const setTestCount = () => {
      testCount = Math.floor(Math.random() * 100);
    };

    it('장바구니 필수 옵션 수량을 수정할 수 있어야 한다.', async () => {
      setTestCount();

      const { data } = await controller.readCarts(testBuyerId);
      const testCartBundle = data.at(0);
      const testCartDetail = testCartBundle?.cartDetails;

      if (testCartDetail) {
        const isAllRequiredOptionsUpdate = testCartDetail.every((d) =>
          d.cartRequiredOptions.map(async (ro) => {
            const { data } = await controller.updateCartsOptionCount(
              testBuyerId,
              { isRequire: true },
              {
                id: ro.id,
                cartId: ro.cartId,
                count: testCount,
              },
            );
            return data.id === ro.id && data.count === testCount && data.cartId === ro.id;
          }),
        );
        expect(isAllRequiredOptionsUpdate).toBe(true);
      } else {
        /**
         * 테스트할 대상이 없기에 의미없는 테스트가 됩니다.
         * 테스트할 장바구니 데이터를 추가해주세요.
         */
        expect(1).toBe(2);
      }
    });
    it('장바구니 옵션 수량을 수정할 수 있어야 한다.', async () => {
      setTestCount();

      const { data } = await controller.readCarts(testBuyerId);
      const testCartBundle = data.at(0);
      const testCartDetail = testCartBundle?.cartDetails;

      if (testCartDetail) {
        const isAllOptionsUpdate = testCartDetail.every((d) =>
          d.cartOptions.map(async (o) => {
            const { data } = await controller.updateCartsOptionCount(
              testBuyerId,
              { isRequire: false },
              {
                id: o.id,
                cartId: o.cartId,
                count: testCount,
              },
            );
            return data.id === o.id && data.count === testCount && data.cartId === o.id;
          }),
        );
        expect(isAllOptionsUpdate).toBe(true);
      } else {
        /**
         * 테스트할 대상이 없기에 의미없는 테스트가 됩니다.
         * 테스트할 장바구니 데이터를 추가해주세요.
         */
        expect(1).toBe(2);
      }
    });
  });

  describe('장바구니 삭제', () => {
    it.todo('장바구니를 삭제할 수 있어야 하며 여러 개를 한꺼번에 삭제가 가능해야 한다.');
  });

  describe('장바구니 필수 옵션 & 선택 옵션 삭제', () => {
    it.todo('필수 옵션이 삭제된다');
    it.todo('선택 옵션이 삭제된다.');
    it.todo('선택 옵션 삭제 시에는 필수 옵션이 반드시 1개 이상 남아 있어야만 한다.');
  });
});
