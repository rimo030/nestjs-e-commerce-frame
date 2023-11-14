import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { BoardEntity } from '../entities/board.entity';

@CustomRepository(BoardEntity)
export class BoardRespository extends Repository<BoardEntity> {}
