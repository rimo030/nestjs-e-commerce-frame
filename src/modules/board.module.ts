import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../configs/custom-typeorm.module';
import { BoardsController } from '../controllers/boards.controller';
import { BoardRepository } from '../repositories/board.repository';
import { BoardsService } from '../services/boards.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([BoardRepository])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
