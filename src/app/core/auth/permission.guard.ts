// ============================================================
// VMS Pro — Permission Guard
// ============================================================
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '@core/services/toast.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAdmin) {
      return true;
    }

    const requiredMenu = route.data['menu'] as string | undefined;
    const requiredPermission = (route.data['permission'] as string) || 'canRead';

    if (!requiredMenu) {
      return true;
    }

    const hasPermission = this.authService.hasPermission(
      requiredMenu,
      requiredPermission as 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canPrint'
    );

    if (hasPermission) {
      return true;
    }

    this.toast.error('Access Denied: You do not have permission to access this page.');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
