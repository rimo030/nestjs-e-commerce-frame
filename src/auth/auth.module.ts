import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRespository } from 'src/repositories/user.repository';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretNumber',
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
    CustomTypeOrmModule.forCustomRepository([UserRespository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
