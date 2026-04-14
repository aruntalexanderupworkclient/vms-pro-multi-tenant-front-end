import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitServiceProxy, VisitDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';
import { PagedResult } from '@core/models/api-response.model';
import { VISIT_STATUS_COLORS } from '@shared/constants/status-colors.constant';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  visits: VisitDto[] = [];
  isLoading = true;
  statusColors = VISIT_STATUS_COLORS;

  page = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  canCreate = false;
  canUpdate = false;

  constructor(
    private router: Router,
    private visitProxy: VisitServiceProxy,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreate = this.auth.hasPermission('Visitors', 'canCreate');
      this.canUpdate = this.auth.hasPermission('Visitors', 'canUpdate');
    });
    this.loadVisits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVisits(): void {
    this.isLoading = true;
    this.visitProxy.getAll(this.page, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as PagedResult<VisitDto>;
          this.visits = data.items;
          this.totalCount = data.totalCount;
          this.totalPages = data.totalPages;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load visits.'); }
    });
  }

  onPageChange(p: number): void { this.page = p; this.loadVisits(); }
  onNew(): void { this.router.navigate(['/visitors/visits/new']); }
  onView(v: VisitDto): void { this.router.navigate(['/visitors/visits', v.id]); }
  onCheckIn(v: VisitDto): void { this.router.navigate(['/visitors/visits', v.id, 'checkin']); }
  onCheckOut(v: VisitDto): void { this.router.navigate(['/visitors/visits', v.id, 'checkout']); }
}
