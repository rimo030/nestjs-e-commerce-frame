import { Module } from '@nestjs/common';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
