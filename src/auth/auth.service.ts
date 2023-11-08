import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRespository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRespository: UserRespository,
  ) {}
}
