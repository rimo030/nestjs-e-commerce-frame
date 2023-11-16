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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('boards')
@ApiTags('Board API')
export class BoardsController {
  private logger = new Logger('Board');
  constructor(private readonly boardsSevice: BoardsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'User Id 로 Board 가져오기 API',
    description: 'User Id로 해당 User가 작성한 board를 가져온다.',
  })
  async getBoardByUserId(@UserId() id: number): Promise<BoardEntity[]> {
    this.logger.verbose(`User ${id} trying to get all boards`);
    return await this.boardsSevice.getBoardByUserId(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Board 생성 API', description: '현재 User의 board를 생성한다.' })
  async createBoard(@Body() createBoardDto: CreateBoardDto, @UserId() id: number): Promise<BoardEntity> {
    this.logger.verbose(`User ${id} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`);
    return await this.boardsSevice.createBoard(createBoardDto, id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Board Id로 Board 가져오기 API', description: '해당 Id를 가진 board를 가져온다.' })
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<BoardEntity> {
    return await this.boardsSevice.getBoardById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Board 삭제하기 API', description: '현재 User가 작성한 게시물들을 id로 삭제한다.' })
  async deleteBoard(@Param('id', ParseIntPipe) boardId: number, @UserId() userId: number): Promise<boolean> {
    return await this.boardsSevice.deleteBoard(boardId, userId);
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Board 공개 여부 갱신하기', description: '해당 id를 가진 board의 상태를 변경' })
  async updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return await this.boardsSevice.updateBoardStatus(id, status);
  }
}
