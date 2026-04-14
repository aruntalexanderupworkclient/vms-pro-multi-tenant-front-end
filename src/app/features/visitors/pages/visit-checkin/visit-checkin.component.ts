import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitServiceProxy, VisitDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-visit-checkin',
  templateUrl: './visit-checkin.component.html',
  styleUrls: ['./visit-checkin.component.scss']
})
export class VisitCheckInComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  visit: VisitDto | null = null;
  visitId!: string;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private visitProxy: VisitServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.visitId = this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({ accessCardNumber: [''] });
    this.loadVisit();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadVisit(): void {
    this.visitProxy.getById(this.visitId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) { this.visit = res.data as VisitDto; }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load visit.'); }
    });
  }

  onCheckIn(): void {
    this.isSaving = true;
    this.visitProxy.checkIn(this.visitId, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.success('Visitor checked in.');
          this.router.navigate(['/visitors/visits', this.visitId]);
        } else {
          this.toast.error(res.message || 'Check-in failed.');
        }
      },
      error: () => { this.isSaving = false; this.toast.error('Check-in failed.'); }
    });
  }

  onCancel(): void { this.router.navigate(['/visitors/visits']); }
}
