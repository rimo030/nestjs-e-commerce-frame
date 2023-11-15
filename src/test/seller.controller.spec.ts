import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from 'src/services/seller.service';
import { SellerEntity } from 'src/entities/seller.entity';

describe('SellerController', () => {
  let controller: SellerController;
  let service: SellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    service = module.get<SellerService>(SellerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('controller.createSeller는 SellerEntity을 리턴해야 한다.', async () => {
    const response = controller.createSeller();
    expect(response instanceof SellerEntity).toBe(true);
  });

  it('controller.getSellerById는 Seller의 name과 email, phone를 리턴해야 한다.', async () => {
    const response = controller.getSellerById();
    expect(response.name).toBeDefined();
    expect(response.email).toBeDefined();
    expect(response.phone).toBeDefined();
  });

  it('controller.getAllSeller는 배열을 리턴해야 한다.', async () => {
    const response = controller.getAllSeller();
    expect(response.length).toBeDefined();
    expect(response instanceof Array).toBe(true);
  });
});
