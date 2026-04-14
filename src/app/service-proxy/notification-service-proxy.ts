// ============================================================
// VMS Pro — Notification Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse, PagedResult } from '@core/models/api-response.model';
import { NotificationDto } from './dto/notification.dto';

@Injectable({ providedIn: 'root' })
export class NotificationServiceProxy {
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20): Observable<ApiResponse<PagedResult<NotificationDto>>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PagedResult<NotificationDto>>>(this.baseUrl, { params });
  }

  markAsRead(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}/read`, {});
  }
}
