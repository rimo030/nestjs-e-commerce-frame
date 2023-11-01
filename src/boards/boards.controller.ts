import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.model';

@Controller('boards')
export class BoardsController {
  constructor(private boardsSevice: BoardsService) {}

  @Get('/')
  getAllBoard(): Board[] {
    return this.boardsSevice.getAllBoards();
  }

  @Post('/')
  createBoard(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Board {
    return this.boardsSevice.createBoard(title, description);
  }
}
