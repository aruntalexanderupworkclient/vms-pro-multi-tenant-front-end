// ============================================================
// VMS Pro — App Routing Module
// ============================================================
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { PermissionGuard } from '@core/auth/permission.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { APP_ROUTES, AUTH_ROUTE } from '@shared/constants/menu.constants';

const routes: Routes = [
  // Auth (no layout)
  {
    path: AUTH_ROUTE.path,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // App routes (with main layout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: APP_ROUTES.DASHBOARD.path,
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { menu: APP_ROUTES.DASHBOARD.menu.name, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.VISITORS.path,
        loadChildren: () => import('./features/visitors/visitors.module').then(m => m.VisitorsModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.VISITORS.menu.permissionName, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.USERS.path,
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.USERS.menu.name, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.ROLES.path,
        loadChildren: () => import('./features/roles/roles.module').then(m => m.RolesModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.ROLES.menu.name, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.LOCATIONS.path,
        loadChildren: () => import('./features/locations/locations.module').then(m => m.LocationsModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.LOCATIONS.menu.name, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.NOTIFICATIONS.path,
        loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: APP_ROUTES.SETTINGS.path,
        loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.SETTINGS.menu.name, permission: 'canRead' }
      },
      {
        path: APP_ROUTES.REPORTS.path,
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [PermissionGuard],
        data: { menu: APP_ROUTES.REPORTS.menu.name, permission: 'canRead' }
      },
      { path: '', redirectTo: APP_ROUTES.DASHBOARD.path, pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: APP_ROUTES.DASHBOARD.path }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
