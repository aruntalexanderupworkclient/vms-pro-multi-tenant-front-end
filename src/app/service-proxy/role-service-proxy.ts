// ============================================================
// VMS Pro — Role Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import { RoleDto, CreateRoleDto, UpdateRoleDto, SetRolePermissionsDto } from './dto/role.dto';

@Injectable({ providedIn: 'root' })
export class RoleServiceProxy {
  private baseUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<RoleDto[]>> {
    return this.http.get<ApiResponse<RoleDto[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<RoleDto>> {
    return this.http.get<ApiResponse<RoleDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateRoleDto): Observable<ApiResponse<RoleDto>> {
    return this.http.post<ApiResponse<RoleDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateRoleDto): Observable<ApiResponse<RoleDto>> {
    return this.http.put<ApiResponse<RoleDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  setPermissions(id: string, dto: SetRolePermissionsDto): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}/permissions`, dto);
  }
}
