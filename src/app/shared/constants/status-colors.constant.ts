// ============================================================
// VMS Pro — Visit Status Colors
// ============================================================

export const VISIT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Scheduled:  { bg: '#E3F2FD', text: '#1565C0' },
  CheckedIn:  { bg: '#E8F5E9', text: '#2E7D32' },
  CheckedOut: { bg: '#F5F5F5', text: '#616161' },
  Cancelled:  { bg: '#FFEBEE', text: '#C62828' },
  NoShow:     { bg: '#FFF8E1', text: '#F57F17' },
  Rejected:   { bg: '#FFEBEE', text: '#B71C1C' },
};
