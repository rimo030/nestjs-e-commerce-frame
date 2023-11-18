import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from 'src/entities/board.entity';
import { BoardRespository } from 'src/repositories/board.repository';
import { CreateBoardDto } from '../entities/dtos/create-board.dto';
import { BoardStatus } from '../types/enums/board-status.enum';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRespository)
    private readonly boardRespository: BoardRespository,
  ) {}

  // 모든 게시물 가져오기
  async getAllBoards(): Promise<BoardEntity[]> {
    return await this.boardRespository.find();
  }

  // User id를 이용해 특정 게시물 가져오기
  // Query Builder 사용
  async getBoardByUserId(id: number): Promise<BoardEntity[]> {
    const query = this.boardRespository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: id });

    const boards = await query.getMany(); // 검색된 쿼리 결과를 전부 가져와라
    if (!boards) {
      throw new NotFoundException(`Can't find Board with User ${id}`);
    }
    return boards;
  }

  // userid, title,description을 받아 게시물 생성하기
  async createBoard(createBoardDto: CreateBoardDto, id: number): Promise<BoardEntity> {
    return await this.boardRespository.save({
      ...createBoardDto,
      status: BoardStatus.PUBLIC,
      userId: id,
    });
  }

  // id를 이용해 특정 게시물 가져오기
  async getBoardById(id: number): Promise<BoardEntity> {
    const board = await this.boardRespository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return board;
  }

  // id를 이용해 특정 자신의 게시물 삭제하기
  async deleteBoard(boardId: number, userId: number): Promise<boolean> {
    try {
      await this.boardRespository.softDelete({ id: boardId, buyerId: userId });
      return true;
    } catch (err) {
      return false;
    }
  }

  // id를 이용해 특정 게시물 갱신하기
  async updateBoardStatus(id: number, status: BoardStatus): Promise<BoardEntity> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRespository.save(board);
    return board;
  }
}
