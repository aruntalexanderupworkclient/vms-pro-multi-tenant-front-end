import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitorServiceProxy, VisitServiceProxy, UserServiceProxy, VisitorDto, VisitDto } from '@service-proxy';
import { VisitStatus } from '@core/models/enums';
import { VISIT_STATUS_COLORS } from '@shared/constants/status-colors.constant';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  stats: StatCard[] = [];
  recentVisitors: VisitorDto[] = [];
  recentVisits: VisitDto[] = [];
  statusColors = VISIT_STATUS_COLORS;
  isLoading = true;

  totalVisitors = 0;
  totalVisitsToday = 0;
  checkedInCount = 0;
  scheduledCount = 0;

  constructor(
    private visitorProxy: VisitorServiceProxy,
    private visitProxy: VisitServiceProxy,
    private userProxy: UserServiceProxy
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.visitorProxy.getAll(1, 5).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) {
        this.recentVisitors = res.data.items;
        this.totalVisitors = res.data.totalCount;
        this.buildStats();
      }
    });

    this.visitProxy.getAll(1, 10).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) {
        this.recentVisits = res.data.items;
        this.totalVisitsToday = res.data.totalCount;
        this.checkedInCount = this.recentVisits.filter(v => v.status === VisitStatus.CheckedIn).length;
        this.scheduledCount = this.recentVisits.filter(v => v.status === VisitStatus.Scheduled).length;
        this.buildStats();
      }
      this.isLoading = false;
    });
  }

  private buildStats(): void {
    this.stats = [
      { title: 'Total Visitors', value: this.totalVisitors, icon: 'people', color: '#2563EB', bgColor: '#EFF6FF' },
      { title: 'Visits Today', value: this.totalVisitsToday, icon: 'event_note', color: '#059669', bgColor: '#ECFDF5' },
      { title: 'Checked In', value: this.checkedInCount, icon: 'login', color: '#D97706', bgColor: '#FFFBEB' },
      { title: 'Scheduled', value: this.scheduledCount, icon: 'schedule', color: '#7C3AED', bgColor: '#F5F3FF' },
    ];
  }

  getStatusClass(status: string): string {
    return 'badge badge-' + status.toLowerCase();
  }
}
