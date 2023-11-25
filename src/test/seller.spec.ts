import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SellerController } from 'src/controllers/sellers.controller';
import { SellerService } from 'src/services/sellers.service';

describe('SellerController', () => {
  let controller: SellerController;
  let service: SellerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SellerService>(SellerService);
    controller = module.get<SellerController>(SellerController);
  });

  it('should be defined.', async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
