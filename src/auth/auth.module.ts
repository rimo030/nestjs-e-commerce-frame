import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CartModule } from 'src/modules/cart.module';
import { CategoryModule } from 'src/modules/category.module';
import { CompanyModule } from 'src/modules/company.module';
import { PrismaModule } from 'src/modules/prisma.module';
import { ProductModule } from 'src/modules/product.module';
import { SellerModule } from 'src/modules/seller.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BuyerJwtStrategy } from './strategies/buyer-jwt.strategy';
import { BuyerLocalStrategy } from './strategies/buyer-local.strategy';
import { SellerJwtStrategy } from './strategies/seller-jwt.strategy';
import { SellerLocalStrategy } from './strategies/seller-local.strategy';

@Module({
  imports: [
    PrismaModule,
    CompanyModule,
    CategoryModule,
    SellerModule,
    ProductModule,
    CartModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BuyerLocalStrategy, SellerLocalStrategy, BuyerJwtStrategy, SellerJwtStrategy],
})
export class AuthModule {}
