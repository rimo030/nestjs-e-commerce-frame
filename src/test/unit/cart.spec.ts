import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { CreateBuyerDto } from 'src/auth/dto/create.buyer.dto';
import { CartController } from 'src/controllers/cart.controller';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { CartService } from 'src/services/cart.service';

describe('CartController', () => {
  let Controller: CartController;
  let Service: CartService;
  let respository: CartRepository;

  let authController: AuthController;

  let buyersRespository: BuyerRepository;
  let productRespository: ProductRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    Controller = module.get<CartController>(CartController);
    Service = module.get<CartService>(CartService);
    respository = module.get<CartRepository>(CartRepository);
    authController = module.get<AuthController>(AuthController);
    buyersRespository = module.get<BuyerRepository>(BuyerRepository);
    productRespository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined.', async () => {
    expect(Controller).toBeDefined();
    expect(Service).toBeDefined();
    expect(respository).toBeDefined();
    expect(authController).toBeDefined();
    expect(buyersRespository).toBeDefined();
    expect(productRespository).toBeDefined();
  });

  /**
   * 장바구니 기능은 구매자 계정 id가 있어야 사용 가능하다.
   * id는 회원가입 후 발급받을 수 있다.
   *
   * product(상품) DB에는 1개 이상의 상품 데이터가 있다고 가정한다.
   */

  it('장바구니 기능은 구매자 계정 id가 있어야 사용 가능하다', async () => {
    /**
     * 구매자 계정 생성
     */
    const randomStringForTest = v4();
    const createBuyerDto: CreateBuyerDto = {
      email: randomStringForTest,
      password: randomStringForTest,
      name: randomStringForTest,
      gender: 1,
      age: 1,
      phone: randomStringForTest.slice(0, 11),
    };

    await authController.buyerSignUp(createBuyerDto);

    /**
     * 계정 생성 확인
     */
    const buyer = await buyersRespository.findOne({
      select: {
        id: true,
      },
      where: {
        email: randomStringForTest,
      },
    });

    expect(buyer).toBeDefined();
  });

  it('product(상품) DB에는 1개 이상의 상품 데이터가 있다.', async () => {
    const products = await productRespository.find();
    expect(products.length > 0).toBe(true);
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
