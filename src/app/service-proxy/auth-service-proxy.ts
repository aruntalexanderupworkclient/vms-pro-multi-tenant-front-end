// ============================================================
// VMS Pro — Auth Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import {
  LoginRequest, RegisterRequest, RefreshTokenRequest,
  GoogleLoginRequest, LoginResponse
} from './dto/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthServiceProxy {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(dto: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, dto);
  }

  register(dto: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/register`, dto);
  }

  refreshToken(dto: RefreshTokenRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/refresh-token`, dto);
  }

  googleLogin(dto: GoogleLoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/google-login`, dto);
  }
}
