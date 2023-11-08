import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRespository } from 'src/repositories/user.repository';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([UserRespository])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
