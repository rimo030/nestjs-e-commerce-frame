import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../configs/custom-typeorm.module';
import { BoardController } from '../controllers/board.controller';
import { BoardRepository } from '../repositories/board.repository';
import { BoardsService } from '../services/boards.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BoardRepository])],
  controllers: [BoardController],
  providers: [BoardsService],
})
export class BoardsModule {}
