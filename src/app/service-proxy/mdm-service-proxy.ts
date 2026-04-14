// ============================================================
// VMS Pro — MDM Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import { MdmItemDto } from './dto/mdm.dto';

@Injectable({ providedIn: 'root' })
export class MdmServiceProxy {
  private baseUrl = `${environment.apiUrl}/mdm`;

  constructor(private http: HttpClient) {}

  getTenantTypes(): Observable<ApiResponse<MdmItemDto[]>> {
    return this.http.get<ApiResponse<MdmItemDto[]>>(`${this.baseUrl}/tenant-types`);
  }

  getPlanTypes(): Observable<ApiResponse<MdmItemDto[]>> {
    return this.http.get<ApiResponse<MdmItemDto[]>>(`${this.baseUrl}/plan-types`);
  }

  getLocationTypes(): Observable<ApiResponse<MdmItemDto[]>> {
    return this.http.get<ApiResponse<MdmItemDto[]>>(`${this.baseUrl}/location-types`);
  }

  getFileTypes(): Observable<ApiResponse<MdmItemDto[]>> {
    return this.http.get<ApiResponse<MdmItemDto[]>>(`${this.baseUrl}/file-types`);
  }

  getEntityTypes(): Observable<ApiResponse<MdmItemDto[]>> {
    return this.http.get<ApiResponse<MdmItemDto[]>>(`${this.baseUrl}/entity-types`);
  }
}
