import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  activeTab = 'general';

  tabs = [
    { key: 'general', label: 'General' },
    { key: 'notifications', label: 'Notification Templates' },
    { key: 'industry', label: 'Industry Config' }
  ];
}
