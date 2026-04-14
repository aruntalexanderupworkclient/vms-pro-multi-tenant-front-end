import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'new', component: UserFormComponent },
  { path: ':id', component: UserDetailComponent },
  { path: ':id/edit', component: UserFormComponent },
];

@NgModule({
  declarations: [UserListComponent, UserFormComponent, UserDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class UsersModule {}
