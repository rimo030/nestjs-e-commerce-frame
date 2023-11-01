import {
  Delete,
  Param,
  Body,
  Controller,
  Get,
  Post,
  Delete,
} from '@nestjs/common';
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

  @Get('/:id')
  getBoardById(@Param('id') id: string): Board {
    return this.boardsSevice.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: sting): void {}
}
