import axios from 'axios';
import { v4 } from 'uuid';
import { CategoryController } from 'src/controllers/category.controller';
import { CreateCategoryDto } from 'src/dtos/create-category.dto';

/**
 * 카테고리 생성을 테스트 합니다.
 * 엔드포인트는 `POST category` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param option 저자할 카테고리의 데이터 입니다. ex. name(이름)
 */
export async function test_create_category(
  PORT: number,
  option?: CreateCategoryDto,
): Promise<ReturnType<CategoryController['createCategory']>> {
  const response = await axios(`http://localhost:${PORT}/category`, {
    method: 'POST',
    data: { name: option?.name ?? v4() } satisfies CreateCategoryDto,
  });

  return response.data as Awaited<ReturnType<CategoryController['createCategory']>>;
}
