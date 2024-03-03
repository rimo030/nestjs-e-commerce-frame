import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { SellerRepository } from '../repositories/seller.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Controller', () => {
  let controller: AuthController;
  let service: AuthService;
  let buyerRepository: BuyerRepository;
  let sellerRepository: SellerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    buyerRepository = module.get<BuyerRepository>(BuyerRepository);
    sellerRepository = module.get<SellerRepository>(SellerRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(buyerRepository).toBeDefined();
    expect(sellerRepository).toBeDefined();
  });

  describe('Buyer 테스트', () => {
    it('회원가입이 되었다면 데이터 베이스에서 이메일을 조회할 수 있어야 한다.', async () => {
      const testBuyer: CreateBuyerDto = {
        email: 'myemail@gmail.com',
        password: 'mypassword1!',
        name: 'myname',
        gender: 1,
        age: 20,
        phone: '01012341234',
      };
      await service.buyerSignUp(testBuyer);
      const savedBuyer = await buyerRepository.findByEmail(testBuyer.email);
      await buyerRepository.deleteById(savedBuyer.id);

      expect(savedBuyer.email).toBe(testBuyer.email);
    });
  });

  describe('Seller 테스트', () => {
    it('회원가입이 되었다면 데이터 베이스에서 이메일을 조회할 수 있어야 한다.', async () => {
      const testSeller: CreateSellerDto = {
        email: 'myemail@gmail.com',
        password: 'mypassword1!',
        name: 'myname',
        phone: '01012341234',
        businessNumber: '12341234',
      };
      await service.sellerSignUp(testSeller);
      const savedSeller = await sellerRepository.findByEmail(testSeller.email);
      await sellerRepository.deleteById(savedSeller.id);

      expect(savedSeller.email).toBe(testSeller.email);
    });
  });
});
