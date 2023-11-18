import { Repository } from 'typeorm';
import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { BoardEntity } from '../entities/board.entity';

@CustomRepository(BoardEntity)
export class BoardRespository extends Repository<BoardEntity> {}
