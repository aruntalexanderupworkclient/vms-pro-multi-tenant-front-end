import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';
import { RoleDetailComponent } from './pages/role-detail/role-detail.component';
import { RolePermissionsComponent } from './pages/role-permissions/role-permissions.component';

const routes: Routes = [
  { path: '', component: RoleListComponent },
  { path: 'new', component: RoleFormComponent },
  { path: ':id', component: RoleDetailComponent },
  { path: ':id/edit', component: RoleFormComponent },
  { path: ':id/permissions', component: RolePermissionsComponent },
];

@NgModule({
  declarations: [RoleListComponent, RoleFormComponent, RoleDetailComponent, RolePermissionsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class RolesModule {}
