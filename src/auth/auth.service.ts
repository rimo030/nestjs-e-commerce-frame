import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UserRespository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRespository: UserRespository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRespository.createUser(authCredentialsDto);
  }
}
