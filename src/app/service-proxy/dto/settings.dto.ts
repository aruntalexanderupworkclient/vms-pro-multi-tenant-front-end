// ============================================================
// VMS Pro — Settings DTOs
// ============================================================

export interface GeneralSettingsDto {
  companyName: string;
  timezone: string;
  dateFormat: string;
  language: string;
  autoCheckoutHours: number;
}

export interface NotificationTemplateDto {
  id: number;
  name: string;
  channel: string;
  enabled: boolean;
}

export interface IndustryConfigDto {
  orgType: string;
  requirePhoto: boolean;
  requireIdScan: boolean;
  maxVisitDuration: number;
  enableTokens: boolean;
  enableAppointments: boolean;
}
