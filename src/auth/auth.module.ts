import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { ProductModule } from 'src/modules/products.module';
import { SellerModule } from 'src/modules/sellers.module';
import { BuyersRespository } from 'src/repositories/buyers.repository';
import { SellersRespository } from 'src/repositories/sellers.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BuyerJwtStrategy } from './strategies/buyer.jwt.strategy';
import { BuyerLocalStrategy } from './strategies/buyer.local.strategy';
import { SellerJwtStrategy } from './strategies/seller.jwt.strategy';
import { SellerLocalStrategy } from './strategies/seller.local.strategy';

@Module({
  imports: [
    //BoardsModule,
    ProductModule,
    SellerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return typeORMConfig(configService);
      },
    }),
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
    CustomTypeOrmModule.forCustomRepository([BuyersRespository, SellersRespository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, BuyerLocalStrategy, SellerLocalStrategy, BuyerJwtStrategy, SellerJwtStrategy],
})
export class AuthModule {}
