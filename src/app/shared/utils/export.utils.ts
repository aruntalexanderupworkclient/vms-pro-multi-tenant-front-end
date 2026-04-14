// ============================================================
// VMS Pro — Export Utilities
// ============================================================

export function exportToCsv(data: Record<string, unknown>[], filename: string, columns?: string[]): void {
  if (!data || data.length === 0) { return; }

  const cols = columns || Object.keys(data[0]);
  const header = cols.join(',');
  const rows = data.map(row =>
    cols.map(col => {
      const val = row[col];
      const str = val !== null && val !== undefined ? String(val) : '';
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
