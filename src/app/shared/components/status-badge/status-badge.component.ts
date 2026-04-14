import { Component, Input } from '@angular/core';
import { VISIT_STATUS_COLORS } from '@shared/constants/status-colors.constant';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="status-badge" [style.background]="colors.bg" [style.color]="colors.text">
      {{ status }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';

  get colors(): { bg: string; text: string } {
    return VISIT_STATUS_COLORS[this.status] || { bg: '#F3F4F6', text: '#6B7280' };
  }
}
