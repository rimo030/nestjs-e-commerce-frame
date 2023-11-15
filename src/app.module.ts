import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product.module';
import { SellerModule } from './modules/seller.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    ProductModule,
    SellerModule,
  ],
})
export class AppModule {}
