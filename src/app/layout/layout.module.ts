// ============================================================
// VMS Pro — Layout Module
// ============================================================
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileDrawerComponent } from './topbar/profile-drawer/profile-drawer.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    ProfileDrawerComponent,
  ],
  imports: [SharedModule],
  exports: [MainLayoutComponent],
})
export class LayoutModule {}
