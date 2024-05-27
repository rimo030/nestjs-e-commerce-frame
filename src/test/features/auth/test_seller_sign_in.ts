import axios from 'axios';
import { AuthController } from 'src/auth/auth.controller';
import { AuthCredentialsDto } from 'src/dtos/auth-credentials.dto';
import { test_seller_sign_up } from './test_seller_sign_up';

/**
 * 판매자의 로그인을 테스트한다.
 * endpoint는 `POST auth/signin-seller` 이다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호
 * @param option 로그인을 하기 위해 필요한 credentials 정보를 담는다. 여기서는 이메일과 패스워드이다.
 * @returns
 */
export async function test_seller_sign_in(
  PORT: number,
  option: AuthCredentialsDto,
): Promise<ReturnType<AuthController['sellerSignIn']>> {
  await test_seller_sign_up(PORT, option);

  const response = await axios(`http://localhost:${PORT}/auth/signin-seller`, {
    method: 'POST',
    data: option satisfies AuthCredentialsDto,
  });

  return response.data as Awaited<ReturnType<AuthController['sellerSignIn']>>;
}
