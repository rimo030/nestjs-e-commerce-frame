import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../configs/custom-typeorm.module';
import { BoardController } from '../controllers/board.controller';
import { BoardRepository } from '../repositories/board.repository';
import { BoardService } from '../services/board.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BoardRepository])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardsModule {}
