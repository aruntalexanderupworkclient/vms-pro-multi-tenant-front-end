import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { SettingsComponent } from './pages/settings/settings.component';
import { GeneralSettingsComponent } from './pages/general-settings/general-settings.component';
import { NotificationTemplateSettingsComponent } from './pages/notification-template-settings/notification-template-settings.component';
import { IndustryConfigSettingsComponent } from './pages/industry-config-settings/industry-config-settings.component';

const routes: Routes = [
  { path: '', component: SettingsComponent }
];

@NgModule({
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent,
    NotificationTemplateSettingsComponent,
    IndustryConfigSettingsComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class SettingsModule {}
