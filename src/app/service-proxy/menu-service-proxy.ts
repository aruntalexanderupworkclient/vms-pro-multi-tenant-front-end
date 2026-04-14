// ============================================================
// VMS Pro — Menu Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import { MenuDto, MenuWithPermissionDto, CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable({ providedIn: 'root' })
export class MenuServiceProxy {
  private baseUrl = `${environment.apiUrl}/menus`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<MenuDto[]>> {
    return this.http.get<ApiResponse<MenuDto[]>>(this.baseUrl);
  }

  getTree(): Observable<ApiResponse<MenuDto[]>> {
    return this.http.get<ApiResponse<MenuDto[]>>(`${this.baseUrl}/tree`);
  }

  getMyMenus(): Observable<ApiResponse<MenuWithPermissionDto[]>> {
    return this.http.get<ApiResponse<MenuWithPermissionDto[]>>(`${this.baseUrl}/my-menus`);
  }

  getByRole(roleId: string): Observable<ApiResponse<MenuWithPermissionDto[]>> {
    return this.http.get<ApiResponse<MenuWithPermissionDto[]>>(`${this.baseUrl}/by-role/${roleId}`);
  }

  create(dto: CreateMenuDto): Observable<ApiResponse<MenuDto>> {
    return this.http.post<ApiResponse<MenuDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateMenuDto): Observable<ApiResponse<MenuDto>> {
    return this.http.put<ApiResponse<MenuDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
