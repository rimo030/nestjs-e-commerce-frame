import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardRespository } from 'src/repositories/board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRespository)
    private boardRespository: BoardRespository,
  ) {}

  // title,description을 받아 게시물 생성하기
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;
    const board = this.boardRespository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    await this.boardRespository.save(board);
    return board;
  }

  // id를 이용해 특정 게시물 가져오기
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRespository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }

  // id를 이용해 특정 게시물 삭제하기 (hard delete)
  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRespository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  // id를 이용해 특정 게시물 갱신하기
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRespository.save(board);

    return board;
  }

  // createBoard(createBoardDto: CreateBoardDto) {
  //   // console.log('count', 'test');

  //   const { title, description } = createBoardDto;

  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };

  //   this.boards.push(board);

  //   return board;
  // }

  // getAllBoards(): Board[] {
  //   return this.boards;
  // }

  // createBoard(createBoardDto: CreateBoardDto) {
  //   // console.log('count', 'test');

  //   const { title, description } = createBoardDto;

  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };

  //   this.boards.push(board);

  //   return board;
  // }

  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);

  //   if (!found) {
  //     throw new NotFoundException(`Can't find Board with id ${id}`);
  //   }
  //   return found;
  // }

  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
