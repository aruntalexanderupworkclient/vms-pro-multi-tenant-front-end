import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VisitorServiceProxy, VisitorDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PagedResult } from '@core/models/api-response.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  visitors: VisitorDto[] = [];
  searchControl = new FormControl('');
  isLoading = true;

  // Pagination
  page = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private router: Router,
    private visitorProxy: VisitorServiceProxy,
    private toast: ToastService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreate = this.auth.hasPermission('Visitors', 'canCreate');
      this.canUpdate = this.auth.hasPermission('Visitors', 'canUpdate');
      this.canDelete = this.auth.hasPermission('Visitors', 'canDelete');
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.loadVisitors();
    });

    this.loadVisitors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVisitors(): void {
    this.isLoading = true;
    this.visitorProxy.getAll(this.page, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as PagedResult<VisitorDto>;
          this.visitors = data.items;
          this.totalCount = data.totalCount;
          this.totalPages = data.totalPages;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load visitors.');
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadVisitors();
  }

  onNew(): void {
    this.router.navigate(['/visitors/new']);
  }

  onView(visitor: VisitorDto): void {
    this.router.navigate(['/visitors', visitor.id]);
  }

  onEdit(visitor: VisitorDto): void {
    this.router.navigate(['/visitors', visitor.id, 'edit']);
  }

  onDelete(visitor: VisitorDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Visitor',
        message: `Are you sure you want to delete "${visitor.fullName}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.visitorProxy.delete(visitor.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
            if (res.success) {
              this.toast.success('Visitor deleted.');
              this.loadVisitors();
            } else {
              this.toast.error(res.message || 'Delete failed.');
            }
          },
          error: () => this.toast.error('Failed to delete visitor.')
        });
      }
    });
  }
}
