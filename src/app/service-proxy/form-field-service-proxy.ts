// ============================================================
// VMS Pro — Form Field Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse } from '@core/models/api-response.model';
import { FormFieldDto, CreateFormFieldDto, UpdateFormFieldDto } from './dto/form-field.dto';

@Injectable({ providedIn: 'root' })
export class FormFieldServiceProxy {
  private baseUrl = `${environment.apiUrl}/form-fields`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<FormFieldDto[]>> {
    return this.http.get<ApiResponse<FormFieldDto[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<FormFieldDto>> {
    return this.http.get<ApiResponse<FormFieldDto>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateFormFieldDto): Observable<ApiResponse<FormFieldDto>> {
    return this.http.post<ApiResponse<FormFieldDto>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateFormFieldDto): Observable<ApiResponse<FormFieldDto>> {
    return this.http.put<ApiResponse<FormFieldDto>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
