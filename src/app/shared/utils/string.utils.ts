// ============================================================
// VMS Pro — String Utilities
// ============================================================

export function getInitials(name: string): string {
  if (!name) { return ''; }
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export function capitalize(text: string): string {
  if (!text) { return ''; }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function camelToTitle(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
