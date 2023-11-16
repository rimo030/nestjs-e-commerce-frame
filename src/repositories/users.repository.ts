import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@CustomRepository(UserEntity)
export class UsersRespository extends Repository<UserEntity> {}
