// ============================================================
// VMS Pro — Visitor Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse, PagedResult } from '@core/models/api-response.model';
import { VisitorDto, CreateVisitorDto, UpdateVisitorDto } from './dto/visitor.dto';

@Injectable({ providedIn: 'root' })
export class VisitorServiceProxy {
  private baseUrl = `${environment.apiUrl}/visitors`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20): Observable<ApiResponse<PagedResult<VisitorDto>>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PagedResult<VisitorDto>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<VisitorDto>> {
    return this.http.get<ApiResponse<VisitorDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateVisitorDto): Observable<ApiResponse<VisitorDto>> {
    return this.http.post<ApiResponse<VisitorDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateVisitorDto): Observable<ApiResponse<VisitorDto>> {
    return this.http.put<ApiResponse<VisitorDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
