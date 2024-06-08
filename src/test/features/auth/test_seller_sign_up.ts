import axios from 'axios';
import { v4 } from 'uuid';
import { AuthController } from 'src/auth/auth.controller';
import { AuthCredentialsDto } from 'src/dtos/auth-credentials.dto';
import { CreateSellerDto } from 'src/dtos/create-seller.dto';

/**
 * 판매자의 회원 가입을 테스트하는 함수이다.
 * e2e로 작성되었으며, 프론트에서 호출한 것과 동일한 과정을 수행한다.
 * 어떠한 옵션도 받지 않으며, 판매자에 대한 정보는 전부 랜덤으로 생성된다.
 *
 *  endpoint는 `POST auth/signup-seller` 에 해당한다.
 *
 * @param PORT 테스트하기 위한 포트를 넣어준다.
 * @param option 만약, 회원가입 시 이메일과 패스워드를 지정하고자 한다면, 값을 대입한다. 단 리턴 결과로 나오지 않으므로 주의한다.
 *
 * @returns 판매자가 회원가입한 후 아이디가 조회된다.
 */
export async function test_seller_sign_up(
  PORT: number,
  option?: AuthCredentialsDto,
): Promise<ReturnType<AuthController['sellerSignUp']>> {
  const response = await axios(`http://localhost:${PORT}/auth/signup-seller`, {
    headers: {},
    method: 'POST',
    data: {
      email: option?.email ?? `${v4().slice(0, 100)}@gmail.com`,
      password: option?.password ?? v4().slice(0, 20),
      name: v4().slice(0, 32),
      phone: v4().slice(0, 11),
      businessNumber: v4().slice(0, 100),
    } satisfies CreateSellerDto,
  });

  return response.data as Awaited<ReturnType<AuthController['sellerSignUp']>>;
}
