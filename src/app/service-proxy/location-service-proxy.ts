// ============================================================
// VMS Pro — Location Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import { LocationDto, CreateLocationDto, UpdateLocationDto } from './dto/location.dto';

@Injectable({ providedIn: 'root' })
export class LocationServiceProxy {
  private baseUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<LocationDto[]>> {
    return this.http.get<ApiResponse<LocationDto[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<LocationDto>> {
    return this.http.get<ApiResponse<LocationDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateLocationDto): Observable<ApiResponse<LocationDto>> {
    return this.http.post<ApiResponse<LocationDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateLocationDto): Observable<ApiResponse<LocationDto>> {
    return this.http.put<ApiResponse<LocationDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
