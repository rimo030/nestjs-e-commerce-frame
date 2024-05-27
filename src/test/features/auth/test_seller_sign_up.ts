import { AuthController } from 'src/auth/auth.controller';
import { CreateSellerDto } from 'src/dtos/create-seller.dto';

/**
 * 판매자의 회원 가입을 테스트하는 함수이다.
 * e2e로 작성되었으며, 프론트에서 호출한 것과 동일한 과정을 수행한다.
 *
 *  endpoint는 `POST auth/signup-seller` 에 해당한다.
 *
 * @returns 판매자가 회원가입한 후 아이디가 조회된다.
 */
export async function test_seller_sign_up(): Promise<ReturnType<AuthController['sellerSignUp']>> {
  const response = await fetch('localhost:3000/auth/signup-seller', {
    headers: {},
    method: 'POST',
    body: JSON.stringify({
      businessNumber: '',
      email: '',
      name: '',
      password: '',
      phone: '',
    } satisfies CreateSellerDto),
  });

  const data: Awaited<ReturnType<AuthController['sellerSignUp']>> = await response.json();
  return data;
}
