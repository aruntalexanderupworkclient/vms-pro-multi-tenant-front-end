import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { VisitorListComponent } from './pages/visitor-list/visitor-list.component';
import { VisitorFormComponent } from './pages/visitor-form/visitor-form.component';
import { VisitorDetailComponent } from './pages/visitor-detail/visitor-detail.component';
import { VisitListComponent } from './pages/visit-list/visit-list.component';
import { VisitFormComponent } from './pages/visit-form/visit-form.component';
import { VisitDetailComponent } from './pages/visit-detail/visit-detail.component';
import { VisitCheckInComponent } from './pages/visit-checkin/visit-checkin.component';
import { VisitCheckOutComponent } from './pages/visit-checkout/visit-checkout.component';

const routes: Routes = [
  { path: '', component: VisitorListComponent },
  { path: 'new', component: VisitorFormComponent },
  { path: 'visits', component: VisitListComponent },
  { path: 'visits/new', component: VisitFormComponent },
  { path: 'visits/:id', component: VisitDetailComponent },
  { path: 'visits/:id/checkin', component: VisitCheckInComponent },
  { path: 'visits/:id/checkout', component: VisitCheckOutComponent },
  { path: ':id', component: VisitorDetailComponent },
  { path: ':id/edit', component: VisitorFormComponent },
];

@NgModule({
  declarations: [
    VisitorListComponent,
    VisitorFormComponent,
    VisitorDetailComponent,
    VisitListComponent,
    VisitFormComponent,
    VisitDetailComponent,
    VisitCheckInComponent,
    VisitCheckOutComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class VisitorsModule {}
