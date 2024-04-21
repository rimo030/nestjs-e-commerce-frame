import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CartController } from 'src/controllers/cart.controller';
import { ProductController } from 'src/controllers/product.controller';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { ProductAllOptionsDto } from 'src/entities/dtos/product-all-options.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import { UpdateCartDto } from 'src/entities/dtos/update-cart.dto';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { CartService } from 'src/services/cart.service';

describe('Cart Controller', () => {
  let controller: CartController;
  let service: CartService;
  let respository: CartRepository;

  let buyerRepository: BuyerRepository;
  let testBuyerId: number;
  let productController: ProductController;

  let testProductId: number;
  let testProduct: ProductAllOptionsDto;
  let testRequiredOption: ProductRequiredOptionJoinInputOptionDto;
  let testOption: ProductOptionDto;
  let testCount = 0;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
    respository = module.get<CartRepository>(CartRepository);
    buyerRepository = module.get<BuyerRepository>(BuyerRepository);
    productController = module.get<ProductController>(ProductController);

    /**
     * 장바구니 기능은 구매자 계정 id가 있어야 사용 가능하다.
     * 아래 회원이 가입되어있다는 가정한다.
     */
    const testBuyer: AuthCredentialsDto = {
      email: 'myemail@gmail.com',
      password: 'mypassword1!',
    };
    const { id, ...rest } = await buyerRepository.findByEmail(testBuyer.email);
    testBuyerId = id;

    /**
     * product(상품) DB에는 1개 이상의 상품 데이터가 있다고 가정한다.
     * 상품은 1개 이상의 필수/선택 옵션을 가져야 한다.
     */
    const products = await productController.getProductList({});
    testProductId = products.data.at(0)?.id as number;
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(respository).toBeDefined();
    expect(buyerRepository).toBeDefined();
    expect(productController).toBeDefined();
  });

  it('장바구니 기능은 구매자 계정 id가 있어야 사용 가능하다', async () => {
    expect(testBuyerId).toBeDefined();
  });

  it('product(상품) DB에는 1개 이상의 상품 데이터가 있다.', async () => {
    expect(testProductId).toBeDefined();
  });

  it('상품은 1개 이상의 필수/선택 옵션을 가져야 한다.', async () => {
    if (testProductId) {
      const { data } = await productController.getProduct(testProductId);
      testProduct = data;
    }
    expect(testProduct).toBeDefined();
    expect(testProduct.productRequiredOptions.data.length > 0).toBeDefined();
    expect(testProduct.productOptions.data.length > 0).toBeDefined();

    if (testProduct.productRequiredOptions.data.length > 0) {
      testRequiredOption = testProduct.productRequiredOptions.data.at(0) as ProductRequiredOptionJoinInputOptionDto;
    }
    if (testProduct.productOptions.data.length > 0) {
      testOption = testProduct.productOptions.data.at(0) as ProductOptionDto;
    }
  });

  /**
   * 첫번째 테스트가 아니라면 skip합니다.
   */
  it.skip('현재 테스트 데이터에 대하여 장바구니는 존재하지 않아야 한다.', async () => {
    const test = await respository.findCart(testBuyerId, testProductId);
    expect(test).toBe(null);
  });

  /**
   * 첫 장바구니 테스트 시에 해당 buyer의 장바구니는 비워져 있어야 합니다.
   * 첫번째 테스트가 아니라면 skip합니다.
   */
  describe('장바구니 조회 - 1 (상품이 담기기전 장바구니 조회를 검증합니다.)', () => {
    it.skip('장바구니 조회가 가능하며 아무것도 없을 때는 빈 배열이 조회되어야 한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);

      expect(data.carts.length).toBe(0);
      expect(data.deliveryFee).toBe(0);
    });
  });

  /**
   * 장바구니, 장바구니 옵션, 장바구니 선택 옵션을 저장 합니다.
   */
  describe('장바구니 생성', () => {
    const setTestCount = () => {
      testCount = Math.floor(Math.random() * 100);
    };

    it('저장된 장바구니는 데이터 베이스에서 조회가능해야 한다.', async () => {
      /**
       * 장바구니의 담을 옵션의 개수를 테스트 마다 다르게 설정합니다.
       */
      setTestCount();

      const testCartDto: CreateCartDto = {
        productId: testProductId,
        cartRequiredOptions: [{ productRequiredOptionId: testRequiredOption.id, count: testCount }],
        cartOptions: [{ productOptionId: testOption.id, count: testCount }],
      };

      const { data } = await controller.addCart(testBuyerId, testCartDto);

      const savedCart = await respository.findCart(testBuyerId, testProductId);
      expect(savedCart).not.toBe(null);

      if (savedCart) {
        expect(data).toBeInstanceOf(CartDto);
        expect(savedCart.productId).toBe(testProductId);
        expect(savedCart.cartRequiredOptions.length > 0).toBe(true);
        expect(savedCart.cartOptions.length > 0).toBe(true);

        expect(savedCart.cartRequiredOptions.at(0)?.productRequiredOptionId).toBe(testRequiredOption.id);
        expect(savedCart.cartOptions.at(0)?.productOptionId).toBe(testOption.id);
      }
    });
    it('이미 존재하는 필수/선택옵션인지 확인하고, 존재할 경우에는 수량만 더해준다.', async () => {
      /**
       * 장바구니의 담을 옵션의 개수를 테스트 마다 다르게 설정합니다.
       */
      setTestCount();

      const testCartDto: CreateCartDto = {
        productId: testProductId,
        cartRequiredOptions: [{ productRequiredOptionId: testRequiredOption.id, count: testCount }],
        cartOptions: [{ productOptionId: testOption.id, count: testCount }],
      };

      const getCart = await respository.findCart(testBuyerId, testProductId);
      expect(getCart).not.toBe(null);

      /**
       *  동일한 물품의 동일한 옵션을 장바구니에 추가합니다.
       */
      const { data } = await controller.addCart(testBuyerId, testCartDto);

      const savedCart = await respository.findCart(testBuyerId, testProductId);
      expect(savedCart).not.toBe(null);

      /**
       * 이미 존재하는 장바구니 임이 검증되었을 때
       */
      if (getCart && savedCart) {
        expect(data).toBeInstanceOf(UpdateCartDto);

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

      const productPromises = data.carts.map(async (group) => {
        const productDetails = await Promise.all(
          group.cartDetail.map(async (c) => {
            const { data } = await productController.getProduct(c.productId);
            return data.bundleId;
          }),
        );
        return productDetails.every((bundleId) => bundleId === group.bundleId);
      });

      // 모든 그룹에 대해 번들 ID가 일치하는지 확인합니다.
      const isTrueBundle = (await Promise.all(productPromises)).every(Boolean);
      expect(isTrueBundle).toBe(true);
    });

    it('어떤 상품 묶음에도 속하지 않은 상품은 각각의 상품 하나를 묶음으로 처리한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);
      const productsWithoutBundle = data.carts.filter((c) => c.bundleId == null);
      // 검증할 데이터가 존재해야 합니다.
      expect(productsWithoutBundle.length > 0).toBe(true);

      const isOneProduct = productsWithoutBundle.every((n) => n.cartDetail.length);
      expect(isOneProduct).toBe(true);
    });

    it('각 상품 묶음은 묶음에 명시된 계산 기준에 맞게 배송비가 책정 되어야 한다.', async () => {
      const { data } = await controller.readCarts(testBuyerId);
      const testCart = data.carts.at(0);

      if (testCart) {
        const chargeStandard = testCart.chargeStandard;
        const charges = testCart.cartDetail.map((c) => c.product.deliveryCharge);

        if (chargeStandard === 'MAX') {
          expect(Math.max(...charges)).toBe(testCart.fixedDeliveryFee);
        } else if (chargeStandard === 'MIN') {
          expect(Math.min(...charges)).toBe(testCart.fixedDeliveryFee);
        } else if (chargeStandard === null) {
          expect(charges.length === 1).toBe(true);
          expect(charges.reduce((acc, c) => acc + c, 0)).toBe(testCart.fixedDeliveryFee);
        }
      }
    });
  });

  describe('장바구니 수정', () => {
    it.todo('장바구니 상품 수량을 수정할 수 있어야 한다.');
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
