import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../configs/custom-typeorm.module';
import { BoardsController } from '../controllers/boards.controller';
import { BoardRespository } from '../repositories/board.repository';
import { BoardsService } from '../services/boards.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BoardRespository])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
