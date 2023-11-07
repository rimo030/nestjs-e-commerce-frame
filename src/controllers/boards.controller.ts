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
} from '@nestjs/common';
import { BoardsService } from '../services/boards.service';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardStatusValidationPipe } from '../pipes/board-status-vaildation.pipe';
import { Board } from 'src/entities/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private boardsSevice: BoardsService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsSevice.createBoard(createBoardDto);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsSevice.getBoardById(id);
  }

  // @Get('/')
  // getAllBoard(): Board[] {
  //   return this.boardsSevice.getAllBoards();
  // }

  // @Post('/')
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   return this.boardsSevice.createBoard(createBoardDto);
  // }

  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.boardsSevice.getBoardById(id);
  // }

  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //   return this.boardsSevice.deleteBoard(id);
  // }

  // @Patch('/:id/status')
  // updateBoardStatus(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ) {
  //   return this.boardsSevice.updateBoardStatus(id, status);
  // }
}
