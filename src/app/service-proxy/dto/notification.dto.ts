// ============================================================
// VMS Pro — Notification DTOs
// ============================================================
import { NotificationChannel, NotificationStatus } from '@core/models/enums';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
  referenceId: string | null;
  referenceType: string | null;
}
