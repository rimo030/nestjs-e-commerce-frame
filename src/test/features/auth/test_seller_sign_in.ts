import axios from 'axios';
import { AuthController } from 'src/auth/auth.controller';
import { AuthCredentialsDto } from 'src/dtos/auth-credentials.dto';
import { test_seller_sign_up } from './test_seller_sign_up';

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
