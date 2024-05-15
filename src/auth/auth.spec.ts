import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateBuyerDto } from 'src/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/dtos/create-seller.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  let jwtService: JwtService;
  let config: ConfigService;

  let testBuyer: CreateBuyerDto;
  let testSeller: CreateSellerDto;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
  });

  testBuyer = {
    email: `${v4().slice(0, 100)}@gmail.com`,
    password: v4().slice(0, 20),
    name: v4().slice(0, 100),
    phone: v4().slice(0, 11),
    gender: 1,
    age: 20,
  };

  testSeller = {
    email: `${v4().slice(0, 100)}@gmail.com`,
    password: v4().slice(0, 20),
    name: v4().slice(0, 10),
    phone: v4().slice(0, 10),
    businessNumber: v4().slice(0, 100),
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(config).toBeDefined();
  });

  describe('Buyer 테스트', () => {
    it('회원가입이 되었다면 데이터 베이스에서 조회할 수 있어야 한다.', async () => {
      await controller.buyerSignUp(testBuyer);
      const savedBuyerId = await service.findBuyerEmail(testBuyer.email);

      expect(savedBuyerId).toBeDefined();
      expect(savedBuyerId).not.toBe(null);
    });

    it('로그인이 되었다면, buyer의 id를 담은 access Token이 발급되어야 한다.', async () => {
      const { id: savedBuyerId } = await service.findBuyerEmail(testBuyer.email);
      expect(savedBuyerId).toBeDefined();
      expect(savedBuyerId).not.toBe(null);

      const { data } = await controller.buyerSignIn(testBuyer, { user: { id: savedBuyerId } });
      const decode = jwtService.decode(data.accessToken);
      expect(decode.id).toBe(savedBuyerId);
    });
  });

  describe('Seller 테스트', () => {
    it('회원가입이 되었다면 데이터 베이스에서 이메일을 조회할 수 있어야 한다.', async () => {
      await controller.sellerSignUp(testSeller);

      const savedSellerId = await service.findSellerEmail(testSeller.email);

      expect(savedSellerId).toBeDefined;
      expect(savedSellerId).not.toBe(null);
    });

    it('로그인이 되었다면, seller id를 담은 access Token이 발급되어야 한다.', async () => {
      const { id: savedSellerId } = await service.findSellerEmail(testSeller.email);
      expect(savedSellerId).toBeDefined;
      expect(savedSellerId).not.toBe(null);

      const { data } = await controller.sellerSignIn(testSeller, { user: { id: savedSellerId } });
      const decode = jwtService.decode(data.accessToken);

      expect(decode.id).toBe(savedSellerId);
    });
  });
});
