import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { PrismaService } from 'src/services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Controller', () => {
  let controller: AuthController;
  let service: AuthService;
  let buyerRepository: BuyerRepository;
  let sellerRepository: SellerRepository;
  let jwtService: JwtService;
  let config: ConfigService;
  let prisma: PrismaService;

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
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(buyerRepository).toBeDefined();
    expect(sellerRepository).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(config).toBeDefined();
    expect(prisma).toBeDefined();
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
      const savedBuyer = await prisma.buyer.findUnique({ where: { email: testBuyer.email } });

      expect(savedBuyer?.email).toBeDefined();
      expect(savedBuyer?.email).not.toBe(null);
      expect(savedBuyer?.email).toBe(testBuyer.email);
    });

    it('로그인이 되었다면, buyer의 id를 담은 access Token이 발급되어야 한다.', async () => {
      const savedBuyer = await prisma.buyer.findUnique({ select: { id: true }, where: { email: testBuyer.email } });
      expect(savedBuyer?.id).not.toBe(null);

      const { accessToken } = await controller.buyerSignIn(testBuyer, { user: { id: savedBuyer?.id } });
      const decode = jwtService.decode(accessToken!);
      expect(decode.id).toBe(savedBuyer?.id);
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
      const savedSeller = await prisma.seller.findUnique({
        select: { email: true },
        where: { email: testSeller.email },
      });
      expect(savedSeller?.email).toBe(testSeller.email);
    });

    it('로그인이 되었다면, seller id를 담은 access Token이 발급되어야 한다.', async () => {
      const savedSeller = await prisma.seller.findUnique({
        select: { id: true },
        where: { email: testSeller.email },
      });
      expect(savedSeller?.id).not.toBe(null);

      const { accessToken } = await controller.sellerSignIn(testSeller, { user: { id: savedSeller?.id } });
      const decode = jwtService.decode(accessToken!);

      expect(decode.id).toBe(savedSeller?.id);
    });
  });
});
