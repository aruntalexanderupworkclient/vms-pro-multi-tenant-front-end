// ============================================================
// VMS Pro — Shared Module
// ============================================================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Pipes
import { InitialsPipe } from './pipes/initials.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

// Directives
import { HasPermissionDirective } from './directives/has-permission.directive';

// Shared Components
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatMenuModule,
  MatTooltipModule,
  MatDividerModule,
  MatChipsModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatSnackBarModule,
];

const PIPES = [
  InitialsPipe,
  TimeAgoPipe,
  TruncatePipe,
];

const DIRECTIVES = [
  HasPermissionDirective,
];

const COMPONENTS = [
  BreadcrumbComponent,
  PageHeaderComponent,
  ConfirmDialogComponent,
  EmptyStateComponent,
  StatusBadgeComponent,
];

@NgModule({
  declarations: [
    ...PIPES,
    ...DIRECTIVES,
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...MATERIAL_MODULES,
    ...PIPES,
    ...DIRECTIVES,
    ...COMPONENTS,
  ],
})
export class SharedModule {}
