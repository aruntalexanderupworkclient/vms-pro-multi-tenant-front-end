// ============================================================
// VMS Pro — Auth DTOs
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  tenantName?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  tenantId: string;
  roleId: string | null;
  roleName: string | null;
  isAdmin: boolean;
  profilePictureUrl: string | null;
}
