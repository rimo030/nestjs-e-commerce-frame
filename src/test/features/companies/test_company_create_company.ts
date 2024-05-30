import axios from 'axios';
import { v4 } from 'uuid';
import { CompanyController } from 'src/controllers/company.controller';
import { CreateCategoryDto } from 'src/dtos/create-category.dto';
import { CreateCompanyDto } from 'src/dtos/create-company.dto';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';

/**
 * 회사 생성을 테스트 합니다.
 * 엔드포인트는 `POST company` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param accessToken 인증에 사용할 판매자 토큰입니다.
 * @param option 저장할 회사의 데이터 입니다.
 */
export async function test_create_company(
  PORT: number,
  accessToken?: string,
  option?: CreateCompanyDto,
): Promise<ReturnType<CompanyController['createCompany']>> {
  if (!accessToken) {
    const signUpResponse = await test_seller_sign_up(PORT);
    accessToken = signUpResponse.data.accessToken;
  }

  const response = await axios(`http://localhost:${PORT}/company`, {
    method: 'POST',
    data: { name: option?.name ?? v4() } satisfies CreateCategoryDto,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data as Awaited<ReturnType<CompanyController['createCompany']>>;
}
