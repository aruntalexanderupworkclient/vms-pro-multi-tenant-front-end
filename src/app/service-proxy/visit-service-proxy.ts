// ============================================================
// VMS Pro — Visit Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse, PagedResult } from '@core/models/api-response.model';
import { VisitDto, CreateVisitDto, CheckInDto, CheckOutDto } from './dto/visit.dto';

@Injectable({ providedIn: 'root' })
export class VisitServiceProxy {
  private baseUrl = `${environment.apiUrl}/visitors/visits`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20, visitorId?: string): Observable<ApiResponse<PagedResult<VisitDto>>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    if (visitorId) {
      params = params.set('visitorId', visitorId);
    }
    return this.http.get<ApiResponse<PagedResult<VisitDto>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<VisitDto>> {
    return this.http.get<ApiResponse<VisitDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateVisitDto): Observable<ApiResponse<VisitDto>> {
    return this.http.post<ApiResponse<VisitDto>>(this.baseUrl, dto);
  }

  checkIn(id: string, dto: CheckInDto): Observable<ApiResponse<VisitDto>> {
    return this.http.put<ApiResponse<VisitDto>>(`${this.baseUrl}/${id}/checkin`, dto);
  }

  checkOut(id: string, dto: CheckOutDto): Observable<ApiResponse<VisitDto>> {
    return this.http.put<ApiResponse<VisitDto>>(`${this.baseUrl}/${id}/checkout`, dto);
  }
}
