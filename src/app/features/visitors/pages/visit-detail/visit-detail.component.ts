import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitServiceProxy, VisitDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { VISIT_STATUS_COLORS } from '@shared/constants/status-colors.constant';

@Component({
  selector: 'app-visit-detail',
  templateUrl: './visit-detail.component.html',
  styleUrls: ['./visit-detail.component.scss']
})
export class VisitDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  visit: VisitDto | null = null;
  isLoading = true;
  statusColors = VISIT_STATUS_COLORS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitProxy: VisitServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.loadVisit(id); }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVisit(id: string): void {
    this.isLoading = true;
    this.visitProxy.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) { this.visit = res.data as VisitDto; }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load visit.'); this.router.navigate(['/visitors/visits']); }
    });
  }

  onBack(): void { this.router.navigate(['/visitors/visits']); }
}
