export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface UserSummaryDto {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthSuccessDto {
  user: UserSummaryDto;
  redirectTo: string;
}
