import { AuthController } from 'src/auth/auth.controller';

export async function test_seller_sign_in(): Promise<ReturnType<AuthController['sellerSignIn']>> {
  return 1 as any;
}
