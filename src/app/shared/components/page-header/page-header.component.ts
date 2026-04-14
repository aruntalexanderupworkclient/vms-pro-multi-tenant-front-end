import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() actionLabel = '';
  @Input() actionIcon = 'add';
  @Input() showAction = true;
  @Output() action = new EventEmitter<void>();
}
