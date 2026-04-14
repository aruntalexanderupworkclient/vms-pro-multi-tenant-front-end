// ============================================================
// VMS Pro — Enums (mirrors backend C# enums)
// ============================================================

export enum VisitStatus {
  Scheduled = 'Scheduled',
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow',
  Rejected = 'Rejected'
}

export enum NotificationChannel {
  Email = 'Email',
  SMS = 'SMS',
  WhatsApp = 'WhatsApp',
  InApp = 'InApp'
}

export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed',
  Read = 'Read'
}
