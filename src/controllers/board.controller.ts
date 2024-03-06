import {
  Param,
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { BuyerJwtAuthGuard } from 'src/auth/guards/buyer.jwt.guard';
import { BoardEntity } from 'src/entities/board.entity';
import { UserId } from 'src/util/decorator/userId.decorator';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardStatusValidationPipe } from '../pipes/board-status-vaildation.pipe';
import { BoardService } from '../services/board.service';
import { BoardStatus } from '../types/enums/board-status.enum';

@UseGuards(BuyerJwtAuthGuard)
@Controller('boards')
export class BoardController {
  private logger = new Logger('Board');
  constructor(private readonly boardSevice: BoardService) {}

  @Get('/')
  async getBoardByUserId(@UserId() id: number): Promise<BoardEntity[]> {
    this.logger.verbose(`User ${id} trying to get all boards`);
    return await this.boardSevice.getBoardByUserId(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  async createBoard(@Body() createBoardDto: CreateBoardDto, @UserId() id: number): Promise<BoardEntity> {
    this.logger.verbose(`User ${id} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`);
    return await this.boardSevice.createBoard(createBoardDto, id);
  }

  @Get('/:id')
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<BoardEntity> {
    return await this.boardSevice.getBoardById(id);
  }

  @Delete('/:id')
  async deleteBoard(@Param('id', ParseIntPipe) boardId: number, @UserId() userId: number): Promise<boolean> {
    return await this.boardSevice.deleteBoard(boardId, userId);
  }

  @Patch('/:id/status')
  async updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return await this.boardSevice.updateBoardStatus(id, status);
  }
}
