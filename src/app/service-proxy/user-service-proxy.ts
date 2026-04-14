// ============================================================
// VMS Pro — User Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse, PagedResult } from '@core/models/api-response.model';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable({ providedIn: 'root' })
export class UserServiceProxy {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20): Observable<ApiResponse<PagedResult<UserDto>>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PagedResult<UserDto>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<UserDto>> {
    return this.http.get<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateUserDto): Observable<ApiResponse<UserDto>> {
    return this.http.post<ApiResponse<UserDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateUserDto): Observable<ApiResponse<UserDto>> {
    return this.http.put<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
