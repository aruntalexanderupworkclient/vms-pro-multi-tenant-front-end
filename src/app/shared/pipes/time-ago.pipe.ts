// ============================================================
// VMS Pro — Time Ago Pipe
// ============================================================
import { Pipe, PipeTransform } from '@angular/core';
import { getRelativeTime } from '@shared/utils/date.utils';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) { return ''; }
    return getRelativeTime(value);
  }
}
