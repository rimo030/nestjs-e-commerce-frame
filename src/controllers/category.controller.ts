import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryService } from 'src/services/category.service';

@Controller('category')
@ApiTags('Categry API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * 중복된 카테고리가 생겨서도 안 된다.
   * 이미 있을 경우에는 생성하지 말아야 한다.
   * 이러한 기본 값 생성 스크립트는 서버 코드와 무관하게 하나의 스크립트로 작성되어야 한다.
   *
   * 어렵다면 일단 넘긴다.
   */

  /**
   * 카테고리는 이미 들어 있는 rows 라고 가정한다.
   * 따라서 새로 추가하는 등 POST API는 없고 오로지 조회 요청만을 테스트한다.
   */
  @Get()
  @ApiOperation({ summary: '카테고리 조회 API', description: '등록된 카테고리를 확인할 수 있다.' })
  async getProduct(): Promise<CategoryEntity[]> {
    return await this.categoryService.getCategory();
  }
}
