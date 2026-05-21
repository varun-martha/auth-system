export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthSuccessResponse {
  user: AuthenticatedUser;
  redirectTo: string;
}

export interface UserSummaryResponse {
  user: AuthenticatedUser;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
