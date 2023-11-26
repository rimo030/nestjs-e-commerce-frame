import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { CartController } from 'src/controllers/cart.controller';
import { CartRespository } from 'src/repositories/cart.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { CartService } from '../services/cart.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductsRespository, CartRespository])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
