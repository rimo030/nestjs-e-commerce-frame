import { EntityRepository, Repository } from 'typeorm';
import { BoardEntity } from '../entities/board.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(BoardEntity)
export class BoardRespository extends Repository<BoardEntity> {}
