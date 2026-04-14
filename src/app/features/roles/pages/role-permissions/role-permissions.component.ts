import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleServiceProxy, MenuServiceProxy, RoleDto, RolePermissionDto } from '@service-proxy';
import { MenuDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

interface PermissionRow {
  menuId: string;
  menuName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  roleId!: string;
  role: RoleDto | null = null;
  permissionRows: PermissionRow[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleProxy: RoleServiceProxy,
    private menuProxy: MenuServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadData(): void {
    this.isLoading = true;
    // Load role first
    this.roleProxy.getById(this.roleId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.role = res.data as RoleDto;
          this.loadMenus();
        } else {
          this.isLoading = false;
          this.toast.error('Failed to load role.');
        }
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load role.'); }
    });
  }

  private loadMenus(): void {
    this.menuProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const menus = res.data as MenuDto[];
          this.buildPermissionMatrix(menus);
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private buildPermissionMatrix(menus: MenuDto[]): void {
    const existingPerms = this.role?.permissions || [];
    this.permissionRows = this.flattenMenus(menus).map(menu => {
      const existing = existingPerms.find(p => p.menuId === menu.id);
      return {
        menuId: menu.id,
        menuName: menu.name,
        canCreate: existing?.canCreate ?? false,
        canRead: existing?.canRead ?? false,
        canUpdate: existing?.canUpdate ?? false,
        canDelete: existing?.canDelete ?? false,
        canPrint: existing?.canPrint ?? false
      };
    });
  }

  private flattenMenus(menus: MenuDto[]): { id: string; name: string }[] {
    const result: { id: string; name: string }[] = [];
    for (const m of menus) {
      result.push({ id: m.id, name: m.name });
      if (m.children && m.children.length > 0) {
        result.push(...this.flattenMenus(m.children));
      }
    }
    return result;
  }

  onSave(): void {
    this.isSaving = true;
    const permissions: RolePermissionDto[] = this.permissionRows.map(r => ({
      menuId: r.menuId,
      menuName: r.menuName,
      canCreate: r.canCreate,
      canRead: r.canRead,
      canUpdate: r.canUpdate,
      canDelete: r.canDelete,
      canPrint: r.canPrint
    }));

    this.roleProxy.setPermissions(this.roleId, { permissions }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.success('Permissions saved.');
          this.router.navigate(['/roles', this.roleId]);
        } else {
          this.toast.error(res.message || 'Failed to save permissions.');
        }
      },
      error: () => { this.isSaving = false; this.toast.error('Failed to save permissions.'); }
    });
  }

  onCancel(): void { this.router.navigate(['/roles', this.roleId]); }

  toggleAll(field: keyof PermissionRow, checked: boolean): void {
    this.permissionRows.forEach(r => {
      if (field !== 'menuId' && field !== 'menuName') {
        (r as any)[field] = checked;
      }
    });
  }
}
