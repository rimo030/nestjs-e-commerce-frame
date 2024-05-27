import axios from 'axios';
import { v4 } from 'uuid';
import { AuthController } from 'src/auth/auth.controller';
import { CreateSellerDto } from 'src/dtos/create-seller.dto';

/**
 * 판매자의 회원 가입을 테스트하는 함수이다.
 * e2e로 작성되었으며, 프론트에서 호출한 것과 동일한 과정을 수행한다.
 * 어떠한 옵션도 받지 않으며, 판매자에 대한 정보는 전부 랜덤으로 생성된다.
 *
 *  endpoint는 `POST auth/signup-seller` 에 해당한다.
 *
 * @returns 판매자가 회원가입한 후 아이디가 조회된다.
 */
export async function test_seller_sign_up(PORT: number): Promise<ReturnType<AuthController['sellerSignUp']>> {
  const response = await axios(`http://localhost:${PORT}/auth/signup-seller`, {
    headers: {},
    method: 'POST',
    data: {
      email: `${v4().slice(0, 100)}@gmail.com`,
      password: v4().slice(0, 20),
      name: v4().slice(0, 10),
      phone: v4().slice(0, 10),
      businessNumber: v4().slice(0, 100),
    } satisfies CreateSellerDto,
  });

  return response.data as Awaited<ReturnType<AuthController['sellerSignUp']>>;
}
