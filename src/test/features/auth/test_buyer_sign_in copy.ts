import axios from 'axios';
import { AuthController } from 'src/auth/auth.controller';

/**
 * 구매자의 토큰 리프레쉬를 테스트한다.
 * endpoint는 `POST auth/refresh` 이다.
 *
 * @param PORT 테스트를 하기 위한 포트 번호
 */
export async function test_buyer_refresh(
  PORT: number,
  refreshToken: string,
): Promise<ReturnType<AuthController['buyerRefresh']>> {
  try {
    const response = await axios(`http://localhost:${PORT}/auth/refresh`, {
      method: 'POST',
      data: { refreshToken } satisfies { refreshToken: string },
    });

    return response.data as Awaited<ReturnType<AuthController['buyerRefresh']>>;

  } catch (error) {
    console.error((error as any).response.data);
    throw new Error(`buyer 리프레쉬 에러: ${(error as Error).message}`);
  }
}