import { todo } from 'node:test';
import { v4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { CartController } from 'src/controllers/cart.controller';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { BuyersRespository } from 'src/repositories/buyers.repository';
import { CartRespository } from 'src/repositories/cart.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { CartService } from 'src/services/cart.service';

describe('CartController', () => {
  let Controller: CartController;
  let Service: CartService;
  let respository: CartRespository;

  let authController: AuthController;

  let buyersRespository: BuyersRespository;
  let productRespository: ProductsRespository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    Controller = module.get<CartController>(CartController);
    Service = module.get<CartService>(CartService);
    respository = module.get<CartRespository>(CartRespository);
    authController = module.get<AuthController>(AuthController);
    buyersRespository = module.get<BuyersRespository>(BuyersRespository);
    productRespository = module.get<ProductsRespository>(ProductsRespository);
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
     * 판매자 계정 생성
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

  todo('');
});
