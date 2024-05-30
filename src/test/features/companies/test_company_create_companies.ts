import axios from 'axios';
import { v4 } from 'uuid';
import { CompanyController } from 'src/controllers/company.controller';
import { CreateCompanyDto } from 'src/dtos/create-company.dto';
import { test_seller_sign_up } from '../auth/test_seller_sign_up';

/**
 * 회사 다수 생성을 테스트 합니다.
 * 엔드포인트는 `POST company/bulk` 입니다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호 입니다.
 * @param accessToken 인증에 사용할 판매자 토큰입니다. 주어지지 않을 경우 임의의 seller가 생성됩니다.
 * @param options 저장할 회사의 데이터 객체 배열 입니다. 주어지지 않을 경우 랜덤한 이름을 가진 임의의 회사를 10개 생성합니다.
 */
export async function test_create_companies(
  PORT: number,
  accessToken?: string,
  options?: CreateCompanyDto[],
): Promise<ReturnType<CompanyController['createCompanies']>> {
  if (!accessToken) {
    const signUpResponse = await test_seller_sign_up(PORT);
    accessToken = signUpResponse.data.accessToken;
  }

  const response = await axios(`http://localhost:${PORT}/company/bulk`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    data:
      options?.map((o) => ({ name: o?.name ?? v4() })) ??
      (Array(10)
        .fill(0)
        .map(() => ({ name: v4() })) satisfies CreateCompanyDto[]),
  });

  return response.data as Awaited<ReturnType<CompanyController['createCompanies']>>;
}
