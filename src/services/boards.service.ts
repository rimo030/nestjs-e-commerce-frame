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

  // 모든 게시물 가져오기
  async getAllBoards(): Promise<Board[]> {
    return (await this.boardRespository.find()).filter(
      (b) => b.deletedAt === null,
    );
  }

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
    const board = await this.boardRespository.findOneBy({ id });

    if (!board || board.deletedAt !== null) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return board;
  }

  // id를 이용해 특정 게시물 삭제하기 (soft delete)
  async deleteBoard(id: number): Promise<void> {
    const board = await this.getBoardById(id);
    board.deletedAt = new Date();
    await this.boardRespository.save(board);

    // (hard delete)
    // const board = await this.boardRespository.delete(id);
    // if (board.affected === 0) {
    //   throw new NotFoundException(`Can't find Board with id ${id}`);
    // }
  }

  // id를 이용해 특정 게시물 갱신하기
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRespository.save(board);

    return board;
  }
}
