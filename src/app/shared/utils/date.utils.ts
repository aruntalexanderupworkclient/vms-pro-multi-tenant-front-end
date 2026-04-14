// ============================================================
// VMS Pro — Date Utilities
// ============================================================

export function isToday(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

export function formatDuration(startIso: string, endIso: string): string {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const diffMs = Math.abs(end - start);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0 && minutes > 0) { return `${hours}h ${minutes}m`; }
  if (hours > 0) { return `${hours}h`; }
  return `${minutes}m`;
}

export function getRelativeTime(iso: string): string {
  const now = Date.now();
  const date = new Date(iso).getTime();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) { return 'Just now'; }
  if (diffMin < 60) { return `${diffMin} min ago`; }
  if (diffHour < 24) { return `${diffHour}h ago`; }
  if (diffDay < 7) { return `${diffDay}d ago`; }
  return new Date(iso).toLocaleDateString();
}
