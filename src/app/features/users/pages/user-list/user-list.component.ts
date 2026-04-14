import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceProxy, UserDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PagedResult } from '@core/models/api-response.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  users: UserDto[] = [];
  isLoading = true;
  page = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private router: Router,
    private userProxy: UserServiceProxy,
    private toast: ToastService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreate = this.auth.hasPermission('Users', 'canCreate');
      this.canUpdate = this.auth.hasPermission('Users', 'canUpdate');
      this.canDelete = this.auth.hasPermission('Users', 'canDelete');
    });
    this.loadUsers();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadUsers(): void {
    this.isLoading = true;
    this.userProxy.getAll(this.page, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as PagedResult<UserDto>;
          this.users = data.items;
          this.totalCount = data.totalCount;
          this.totalPages = data.totalPages;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load users.'); }
    });
  }

  onPageChange(p: number): void { this.page = p; this.loadUsers(); }
  onNew(): void { this.router.navigate(['/users/new']); }
  onView(u: UserDto): void { this.router.navigate(['/users', u.id]); }
  onEdit(u: UserDto): void { this.router.navigate(['/users', u.id, 'edit']); }

  onDelete(u: UserDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete User', message: `Delete "${u.fullName}"?`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userProxy.delete(u.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => { if (res.success) { this.toast.success('User deleted.'); this.loadUsers(); } else { this.toast.error(res.message || 'Delete failed.'); } },
          error: () => this.toast.error('Failed to delete user.')
        });
      }
    });
  }
}
