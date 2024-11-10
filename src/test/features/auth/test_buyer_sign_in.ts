import axios from 'axios';
import { AuthController } from 'src/auth/auth.controller';
import { AuthCredentialsRequestDto } from 'src/dtos/auth-credentials.request.dto';
import { test_buyer_sign_up } from './test_buyer_sign_up';

/**
 * 구매자의 로그인을 테스트한다.
 * endpoint는 `POST auth/signin` 이다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호
 * @param option 로그인을 하기 위해 필요한 credentials 정보를 담는다. 여기서는 이메일과 패스워드이다.
 * @returns
 */
export async function test_buyer_sign_in(
  PORT: number,
  option: AuthCredentialsRequestDto,
): Promise<ReturnType<AuthController['buyerSignIn']>> {
  try {
    await test_buyer_sign_up(PORT, option);

    const response = await axios(`http://localhost:${PORT}/auth/signin`, {
      method: 'POST',
      data: option satisfies AuthCredentialsRequestDto,
    });

    return response.data as Awaited<ReturnType<AuthController['buyerSignIn']>>;
  } catch (error) {
    console.error((error as any).response.data);
    throw new Error(`buyer 로그인 에러: ${(error as Error).message}`);
  }
}
