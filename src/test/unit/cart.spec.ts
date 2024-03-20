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
  let testBuyerId: number | undefined;
  let productController: ProductController;

  let testProductId: number | undefined;
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
    testProductId = products.data.at(0)?.id;
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

  it(' 상품은 1개 이상의 필수/선택 옵션을 가져야 한다.', async () => {
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

  it('현재 테스트 데이터에 대하여 장바구니는 존재하지 않아야 한다.', async () => {
    const test = await respository.findCart(testBuyerId as number, testProductId as number);
    expect(test).toBe(null);
  });

  /**
   * 장바구니, 장바구니 옵션, 장바구니 선택 옵션을 저장한다.
   */
  describe('장바구니 생성', () => {
    const setTestCount = () => {
      testCount = Math.floor(Math.random() * 100);
    };

    it('저장된 장바구니는 데이터 베이스에서 조회가능해야 한다.', async () => {
      setTestCount();
      const testCartDto: CreateCartDto = {
        productId: testProductId as number,
        cartRequiredOptions: [{ productRequiredOptionId: testRequiredOption.id as number, count: testCount }],
        cartOptions: [{ productOptionId: testOption.id as number, count: testCount }],
      };

      const { data } = await controller.addCart(testBuyerId as number, testCartDto);

      const savedCart = await respository.findCart(testBuyerId as number, testProductId as number);
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
      setTestCount();
      const testCartDto: CreateCartDto = {
        productId: testProductId as number,
        cartRequiredOptions: [{ productRequiredOptionId: testRequiredOption.id as number, count: testCount }],
        cartOptions: [{ productOptionId: testOption.id as number, count: testCount }],
      };

      const getCart = await respository.findCart(testBuyerId as number, testProductId as number);
      expect(getCart).not.toBe(null);

      const { data } = await controller.addCart(testBuyerId as number, testCartDto);

      const savedCart = await respository.findCart(testBuyerId as number, testProductId as number);
      expect(savedCart).not.toBe(null);

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

  describe('장바구니 조회', () => {
    it.todo('장바구니 조회가 가능하며 아무것도 없을 때는 빈 배열이 조회되어야 한다.');
    it.todo('장바구니 상품들은 배송비 계산을 위해 상품 묶음을 기준으로 묶여서 조회되어야 한다.');
    it.todo('어떤 상품 묶음에도 속하지 않은 상품의 장바구니들도 동일한 구조로써 상품 묶음 ( = 빈 묶음)에 묶여야 한다.');

    /**
     * 테스트할 함수를 내부 함수로 잘게 분리해두면 DB에서 데이터를 꺼낼 필요 없이 가능하다.
     */
    it.todo('각 번들은 배송비 계산 기준에 맞게 계산이 되어야 한다.');
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
