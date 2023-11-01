import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsSevice: BoardsService) {}

  @Get('/')
  getAllBoard(): Board[] {
    return this.boardsSevice.getAllBoards();
  }

  @Post('/')
  createBoard(@Body() createBoardDto: CreateBoardDto): Board {
    return this.boardsSevice.createBoard(createBoardDto);
  }
}
