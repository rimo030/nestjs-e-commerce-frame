import { Module } from '@nestjs/common';
import { CartController } from 'src/controllers/cart.controller';
import { CartService } from '../services/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
