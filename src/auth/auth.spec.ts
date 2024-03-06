import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateBuyerDto } from './dto/create.buyer.dto';
import { CreateSellerDto } from './dto/create.seller.dto';

describe('Controller', () => {
  let controller: AuthController;
  let service: AuthService;
  let buyerRepository: BuyerRepository;
  let sellerRepository: SellerRepository;
  let jwtService: JwtService;
  let config: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    buyerRepository = module.get<BuyerRepository>(BuyerRepository);
    sellerRepository = module.get<SellerRepository>(SellerRepository);
    jwtService = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(buyerRepository).toBeDefined();
    expect(sellerRepository).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(config).toBeDefined();
  });

  describe('Buyer 테스트', () => {
    const testBuyer: CreateBuyerDto = {
      email: 'myemail@gmail.com',
      password: 'mypassword1!',
      name: 'myname',
      gender: 1,
      age: 20,
      phone: '01012341234',
    };

    it('회원가입이 되었다면 데이터 베이스에서 이메일을 조회할 수 있어야 한다.', async () => {
      await controller.buyerSignUp(testBuyer);
      const savedBuyer = await buyerRepository.findByEmail(testBuyer.email);
      await buyerRepository.deleteById(savedBuyer.id);

      expect(savedBuyer.email).toBe(testBuyer.email);
    });

    it('로그인이 되었다면, buyer의 id를 담은 access Token이 발급되어야 한다.', async () => {
      await controller.buyerSignUp(testBuyer);
      const { id, ...rest } = await buyerRepository.findByEmail(testBuyer.email);

      const { accessToken } = await controller.buyerSignIn(testBuyer, { user: { id } });
      const decode = jwtService.decode(accessToken!);
      await buyerRepository.deleteById(id);

      expect(decode.id).toBe(id);
    });
  });

  describe('Seller 테스트', () => {
    const testSeller: CreateSellerDto = {
      email: 'myemail@gmail.com',
      password: 'mypassword1!',
      name: 'myname',
      phone: '01012341234',
      businessNumber: '12341234',
    };

    it('회원가입이 되었다면 데이터 베이스에서 이메일을 조회할 수 있어야 한다.', async () => {
      await controller.sellerSignUp(testSeller);
      const savedSeller = await sellerRepository.findByEmail(testSeller.email);
      await sellerRepository.deleteById(savedSeller.id);

      expect(savedSeller.email).toBe(testSeller.email);
    });

    it('로그인이 되었다면, seller id를 담은 access Token이 발급되어야 한다.', async () => {
      await controller.sellerSignUp(testSeller);
      const { id, ...rest } = await sellerRepository.findByEmail(testSeller.email);

      const { accessToken } = await controller.sellerSignIn(testSeller, { user: { id } });
      const decode = jwtService.decode(accessToken!);
      await sellerRepository.deleteById(id);

      expect(decode.id).toBe(id);
    });
  });
});
