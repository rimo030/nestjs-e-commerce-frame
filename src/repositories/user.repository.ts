import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';

@CustomRepository(UserEntity)
export class UserRespository extends Repository<UserEntity> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {}
}
