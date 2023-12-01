import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { CartController } from 'src/controllers/cart.controller';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { CartService } from '../services/cart.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductRepository, CartRepository])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
