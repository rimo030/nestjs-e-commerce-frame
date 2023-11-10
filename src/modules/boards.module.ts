import { Module } from '@nestjs/common';
import { BoardsController } from '../controllers/boards.controller';
import { BoardsService } from '../services/boards.service';
import { BoardRespository } from '../repositories/board.repository';
import { CustomTypeOrmModule } from '../configs/custom-typeorm.module';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BoardRespository])],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsModule],
})
export class BoardsModule {}
