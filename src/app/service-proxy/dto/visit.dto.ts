// ============================================================
// VMS Pro — Visit DTOs
// ============================================================
import { VisitStatus } from '@core/models/enums';

export interface VisitDto {
  id: string;
  visitorId: string;
  visitorName: string | null;
  hostId: string;
  hostName: string | null;
  locationId: string | null;
  locationName: string | null;
  purpose: string | null;
  status: VisitStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  qrCode: string | null;
  accessCardNumber: string | null;
  scheduledDateTime: string;
  remarks: string | null;
  createdAt: string;
}

export interface CreateVisitDto {
  visitorId: string;
  hostId: string;
  locationId?: string;
  purpose?: string;
  scheduledDateTime: string;
  remarks?: string;
}

export interface CheckInDto {
  accessCardNumber?: string;
}

export interface CheckOutDto {
  remarks?: string;
}
