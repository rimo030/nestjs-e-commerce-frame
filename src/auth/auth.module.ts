import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BuyersRespository } from 'src/repositories/buyers.repository';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { BoardsModule } from 'src/modules/boards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellersRespository } from 'src/repositories/sellers.repository';
import { BuyerLocalStrategy } from './strategies/buyer.local.strategy';
import { SellerLocalStrategy } from './strategies/seller.local.strategy';
import { BuyerJwtStrategy } from './strategies/buyer.jwt.strategy';
import { SellerJwtStrategy } from './strategies/seller.jwt.strategy';

@Module({
  imports: [
    //BoardsModule,
    TypeOrmModule.forRoot(typeORMConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
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
