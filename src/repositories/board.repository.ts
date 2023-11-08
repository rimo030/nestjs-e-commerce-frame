import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';

@CustomRepository(Board)
export class BoardRespository extends Repository<Board> {}
