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
import { BoardsService } from '../services/boards.service';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardStatusValidationPipe } from '../pipes/board-status-vaildation.pipe';
import { BoardEntity } from 'src/entities/board.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/auth/userid.decorator';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  private logger = new Logger('Board');
  constructor(private readonly boardsSevice: BoardsService) {}

  @Get('/')
  async getBoardByUserId(@UserId() id: number): Promise<BoardEntity[]> {
    this.logger.verbose(`User ${id} trying to get all boards`);
    return await this.boardsSevice.getBoardByUserId(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  async createBoard(@Body() createBoardDto: CreateBoardDto, @UserId() id: number): Promise<BoardEntity> {
    this.logger.verbose(`User ${id} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`);
    return await this.boardsSevice.createBoard(createBoardDto, id);
  }

  @Get('/:id')
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<BoardEntity> {
    return await this.boardsSevice.getBoardById(id);
  }

  @Delete('/:id')
  async deleteBoard(@Param('id', ParseIntPipe) boardId: number, @UserId() userId: number): Promise<boolean> {
    return await this.boardsSevice.deleteBoard(boardId, userId);
  }

  @Patch('/:id/status')
  async updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return await this.boardsSevice.updateBoardStatus(id, status);
  }
}
