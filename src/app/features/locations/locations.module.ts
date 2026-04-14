import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { LocationListComponent } from './pages/location-list/location-list.component';
import { LocationFormComponent } from './pages/location-form/location-form.component';

const routes: Routes = [
  { path: '', component: LocationListComponent },
  { path: 'new', component: LocationFormComponent },
  { path: ':id/edit', component: LocationFormComponent },
];

@NgModule({
  declarations: [LocationListComponent, LocationFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class LocationsModule {}
