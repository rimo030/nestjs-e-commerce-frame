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
} from '@nestjs/common';
import { BoardsService } from '../services/boards.service';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardStatusValidationPipe } from '../pipes/board-status-vaildation.pipe';
import { Board } from 'src/entities/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private boardsSevice: BoardsService) {}

  @Get('/')
  async getAllBoard(): Promise<Board[]> {
    return await this.boardsSevice.getAllBoards();
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardsSevice.createBoard(createBoardDto);
  }

  @Get('/:id')
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return await this.boardsSevice.getBoardById(id);
  }

  @Delete('/:id')
  async deleteBoard(@Param('id', ParseIntPipe) id): Promise<void> {
    return await this.boardsSevice.deleteBoard(id);
  }

  @Patch('/:id/status')
  async updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return await this.boardsSevice.updateBoardStatus(id, status);
  }
}
