import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  controllers: [SellerController],
  providers: [SellerService]
})
export class SellerModule {}
