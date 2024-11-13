export interface BuyerKakaoCredentialsRequest {
  id: string;
  accessToken: string;
  refreshToken: string;
  name?: string | null;
}
