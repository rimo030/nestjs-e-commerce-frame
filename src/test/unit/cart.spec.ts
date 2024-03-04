import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { CartController } from 'src/controllers/cart.controller';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
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

  describe('장바구니 기능에 대한 명세', () => {
    it.todo('장바구니 조회가 가능하며 아무것도 없을 때는 빈 배열이 조회되어야 한다.');
    it.todo('장바구니에서 상품을 뺄 수 있어야 한다.');
  });
});
