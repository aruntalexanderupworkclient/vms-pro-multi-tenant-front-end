import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitServiceProxy, VisitDto } from '@service-proxy';
import { PagedResult } from '@core/models/api-response.model';
import { VISIT_STATUS_COLORS } from '@shared/constants/status-colors.constant';
import { exportToCsv } from '@shared/utils/export.utils';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  visits: VisitDto[] = [];
  isLoading = true;
  statusColors = VISIT_STATUS_COLORS;

  // Summary stats
  totalVisits = 0;
  checkedInCount = 0;
  checkedOutCount = 0;
  scheduledCount = 0;

  constructor(private visitProxy: VisitServiceProxy) {}

  ngOnInit(): void { this.loadData(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadData(): void {
    this.isLoading = true;
    this.visitProxy.getAll(1, 100).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as PagedResult<VisitDto>;
          this.visits = data.items;
          this.totalVisits = data.totalCount;
          this.checkedInCount = this.visits.filter(v => v.status === 'CheckedIn').length;
          this.checkedOutCount = this.visits.filter(v => v.status === 'CheckedOut').length;
          this.scheduledCount = this.visits.filter(v => v.status === 'Scheduled').length;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  exportVisits(): void {
    const rows = this.visits.map(v => ({
      Visitor: v.visitorName || '',
      Host: v.hostName || '',
      Location: v.locationName || '',
      Purpose: v.purpose || '',
      Status: v.status,
      Scheduled: v.scheduledDateTime,
      CheckIn: v.checkInTime || '',
      CheckOut: v.checkOutTime || ''
    }));
    exportToCsv(rows, 'visits-report');
  }
}
