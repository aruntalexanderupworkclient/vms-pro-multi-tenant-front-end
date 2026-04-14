import { Component } from '@angular/core';
import { APP_NAME } from '@shared/constants/app.constants';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span>&copy; {{ year }} {{ appName }}. All rights reserved.</span>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
      border-top: 1px solid #E5E7EB;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
  appName = APP_NAME;
}
