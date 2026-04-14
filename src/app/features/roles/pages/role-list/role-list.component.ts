import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleServiceProxy, RoleDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  roles: RoleDto[] = [];
  isLoading = true;
  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private router: Router,
    private roleProxy: RoleServiceProxy,
    private toast: ToastService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreate = this.auth.hasPermission('Roles', 'canCreate');
      this.canUpdate = this.auth.hasPermission('Roles', 'canUpdate');
      this.canDelete = this.auth.hasPermission('Roles', 'canDelete');
    });
    this.loadRoles();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadRoles(): void {
    this.isLoading = true;
    this.roleProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { if (res.success && res.data) { this.roles = res.data as RoleDto[]; } this.isLoading = false; },
      error: () => { this.isLoading = false; this.toast.error('Failed to load roles.'); }
    });
  }

  onNew(): void { this.router.navigate(['/roles/new']); }
  onView(r: RoleDto): void { this.router.navigate(['/roles', r.id]); }
  onEdit(r: RoleDto): void { this.router.navigate(['/roles', r.id, 'edit']); }
  onPermissions(r: RoleDto): void { this.router.navigate(['/roles', r.id, 'permissions']); }

  onDelete(r: RoleDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Role', message: `Delete role "${r.name}"?`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleProxy.delete(r.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => { if (res.success) { this.toast.success('Role deleted.'); this.loadRoles(); } else { this.toast.error(res.message || 'Delete failed.'); } },
          error: () => this.toast.error('Failed to delete role.')
        });
      }
    });
  }
}
