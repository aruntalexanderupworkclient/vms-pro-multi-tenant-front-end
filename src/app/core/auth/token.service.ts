// ============================================================
// VMS Pro — Token Service
// ============================================================
import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'vms_access_token';
const REFRESH_TOKEN_KEY = 'vms_refresh_token';
const ACCESS_TOKEN_EXPIRY_KEY = 'vms_access_token_expires';
const REFRESH_TOKEN_EXPIRY_KEY = 'vms_refresh_token_expires';

@Injectable({ providedIn: 'root' })
export class TokenService {

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string, accessExpiresAt: string, refreshExpiresAt: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, accessExpiresAt);
    localStorage.setItem(REFRESH_TOKEN_EXPIRY_KEY, refreshExpiresAt);
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRY_KEY);
  }

  isAccessTokenExpired(): boolean {
    const expiry = localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
    if (!expiry) { return true; }
    return new Date(expiry).getTime() <= Date.now();
  }

  isRefreshTokenExpired(): boolean {
    const expiry = localStorage.getItem(REFRESH_TOKEN_EXPIRY_KEY);
    if (!expiry) { return true; }
    return new Date(expiry).getTime() <= Date.now();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isAccessTokenExpired();
  }

  decodeToken(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
