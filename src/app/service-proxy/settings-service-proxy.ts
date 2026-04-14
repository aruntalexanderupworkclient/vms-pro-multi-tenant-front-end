// ============================================================
// VMS Pro — Settings Service Proxy (In-Memory / Fake API)
// ============================================================
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse } from '@core/models/api-response.model';
import {
  GeneralSettingsDto,
  NotificationTemplateDto,
  IndustryConfigDto
} from './dto/settings.dto';

@Injectable({ providedIn: 'root' })
export class SettingsServiceProxy {

  // ── Fake endpoint: GET /api/settings/general ──
  private generalSettings: GeneralSettingsDto = {
    companyName: 'VMS Pro Corporation',
    timezone: 'UTC+5:30',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    autoCheckoutHours: 8
  };

  // ── Fake endpoint: GET /api/settings/notification-templates ──
  private notificationTemplates: NotificationTemplateDto[] = [
    { id: 1, name: 'Visitor Check-In', channel: 'Email + SMS', enabled: true },
    { id: 2, name: 'Visitor Check-Out', channel: 'Email', enabled: true },
    { id: 3, name: 'Appointment Reminder', channel: 'SMS', enabled: false },
    { id: 4, name: 'Token Expiry Warning', channel: 'Push', enabled: true }
  ];

  // ── Fake endpoint: GET /api/settings/industry-config ──
  private industryConfig: IndustryConfigDto = {
    orgType: 'Corporate Office',
    requirePhoto: true,
    requireIdScan: false,
    maxVisitDuration: 8,
    enableTokens: true,
    enableAppointments: true
  };

  // ── Helper ──
  private success<T>(data: T): Observable<ApiResponse<T>> {
    return of({
      success: true,
      message: 'OK',
      data,
      errorCode: null
    }).pipe(delay(300));
  }

  // ═══════════════════════════════════════════════════════════
  // General Settings
  // Fake: GET  /api/settings/general
  // Fake: PUT  /api/settings/general
  // ═══════════════════════════════════════════════════════════
  getGeneralSettings(): Observable<ApiResponse<GeneralSettingsDto>> {
    return this.success({ ...this.generalSettings });
  }

  updateGeneralSettings(dto: GeneralSettingsDto): Observable<ApiResponse<GeneralSettingsDto>> {
    this.generalSettings = { ...dto };
    return this.success({ ...this.generalSettings });
  }

  // ═══════════════════════════════════════════════════════════
  // Notification Templates
  // Fake: GET  /api/settings/notification-templates
  // Fake: PUT  /api/settings/notification-templates/:id/toggle
  // Fake: PUT  /api/settings/notification-templates  (bulk save)
  // ═══════════════════════════════════════════════════════════
  getNotificationTemplates(): Observable<ApiResponse<NotificationTemplateDto[]>> {
    return this.success(this.notificationTemplates.map(t => ({ ...t })));
  }

  toggleNotificationTemplate(id: number): Observable<ApiResponse<NotificationTemplateDto>> {
    const tmpl = this.notificationTemplates.find(t => t.id === id);
    if (tmpl) {
      tmpl.enabled = !tmpl.enabled;
      return this.success({ ...tmpl });
    }
    return of({ success: false, message: 'Template not found', data: null, errorCode: 'NOT_FOUND' }).pipe(delay(300));
  }

  updateNotificationTemplates(templates: NotificationTemplateDto[]): Observable<ApiResponse<NotificationTemplateDto[]>> {
    this.notificationTemplates = templates.map(t => ({ ...t }));
    return this.success(this.notificationTemplates.map(t => ({ ...t })));
  }

  // ═══════════════════════════════════════════════════════════
  // Industry Config
  // Fake: GET  /api/settings/industry-config
  // Fake: PUT  /api/settings/industry-config
  // ═══════════════════════════════════════════════════════════
  getIndustryConfig(): Observable<ApiResponse<IndustryConfigDto>> {
    return this.success({ ...this.industryConfig });
  }

  updateIndustryConfig(dto: IndustryConfigDto): Observable<ApiResponse<IndustryConfigDto>> {
    this.industryConfig = { ...dto };
    return this.success({ ...this.industryConfig });
  }
}
