import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@CustomRepository(UserEntity)
export class UserRespository extends Repository<UserEntity> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { name, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ name, hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      throw new HttpException('유효한 값이 아닙니다.', 401);
      //   if (error.code === '23505') {
      //     throw new ConflictException('Existing user name');
      //   } else {
      //     throw new InternalServerErrorException();
      //   }
    }
  }
}
