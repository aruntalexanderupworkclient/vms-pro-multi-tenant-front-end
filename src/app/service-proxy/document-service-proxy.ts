// ============================================================
// VMS Pro — Document Service Proxy
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ApiResponse, PagedResult } from '@core/models/api-response.model';
import { DocumentDto, UploadDocumentDto } from './dto/document.dto';

@Injectable({ providedIn: 'root' })
export class DocumentServiceProxy {
  private baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20, entityId?: string): Observable<ApiResponse<PagedResult<DocumentDto>>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    if (entityId) {
      params = params.set('entityId', entityId);
    }
    return this.http.get<ApiResponse<PagedResult<DocumentDto>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<DocumentDto>> {
    return this.http.get<ApiResponse<DocumentDto>>(`${this.baseUrl}/${id}`);
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }

  upload(file: File, dto?: UploadDocumentDto): Observable<ApiResponse<DocumentDto>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (dto?.entityTypeId) { formData.append('entityTypeId', dto.entityTypeId); }
    if (dto?.fileTypeId) { formData.append('fileTypeId', dto.fileTypeId); }
    if (dto?.entityId) { formData.append('entityId', dto.entityId); }
    if (dto?.description) { formData.append('description', dto.description); }
    return this.http.post<ApiResponse<DocumentDto>>(`${this.baseUrl}/upload`, formData);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
