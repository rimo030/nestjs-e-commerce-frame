export interface BuyerGoogleCredentialsRequest {
  id: string;
  accessToken: string;
  refreshToken: string;
  email?: string | null;
  name?: string | null;
}
