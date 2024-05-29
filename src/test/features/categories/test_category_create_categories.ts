import axios from 'axios';
import { v4 } from 'uuid';
import { CategoryController } from 'src/controllers/category.controller';
import { CreateCategoryDto } from 'src/dtos/create-category.dto';

/**
 * 카테고리 다수 생성을 테스트 합니다.
 * 엔드포인트는 `POST category` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param options 저자할 카테고리의 데이터 배열 입니다. 주어지지 않을 경우 랜덤한 이름을 가진 카테고리 10개를 생성합니다.
 */
export async function test_create_categories(
  PORT: number,
  options?: CreateCategoryDto[],
): Promise<ReturnType<CategoryController['createCategories']>> {
  const response = await axios(`http://localhost:${PORT}/category/bulk`, {
    method: 'POST',
    data:
      options?.map((o) => ({ name: o?.name ?? v4() })) ??
      (Array(10)
        .fill(0)
        .map(() => ({ name: v4() })) satisfies CreateCategoryDto[]),
  });

  return response.data as Awaited<ReturnType<CategoryController['createCategories']>>;
}
