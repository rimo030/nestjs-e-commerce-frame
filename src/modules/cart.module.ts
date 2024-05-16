import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from 'src/controllers/cart.controller';
import { CartOptionEntity } from 'src/entities/cart-option.entity';
import { CartRequiredOptionEntity } from 'src/entities/cart-required-option.entity';
import { CartEntity } from 'src/entities/cart.entity';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { CartOptionRepository } from 'src/repositories/cart-option.repository';
import { CartRequiredOptionRepository } from 'src/repositories/cart-required-option.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { CartService } from 'src/services/cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, ProductBundleEntity, CartRequiredOptionEntity, CartOptionEntity])],
  controllers: [CartController],
  providers: [CartService, ProductBundleRepository, CartRepository, CartRequiredOptionRepository, CartOptionRepository],
})
export class CartModule {}
