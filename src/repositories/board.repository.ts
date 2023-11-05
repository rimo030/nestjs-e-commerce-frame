import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(Board)
export class BoardRespository extends Repository<Board> {}
