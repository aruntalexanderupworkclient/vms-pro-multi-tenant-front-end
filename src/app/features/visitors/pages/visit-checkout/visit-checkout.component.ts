import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitServiceProxy, VisitDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-visit-checkout',
  templateUrl: './visit-checkout.component.html',
  styleUrls: ['./visit-checkout.component.scss']
})
export class VisitCheckOutComponent implements OnInit, OnDestroy {
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
    this.form = this.fb.group({ remarks: [''] });
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

  onCheckOut(): void {
    this.isSaving = true;
    this.visitProxy.checkOut(this.visitId, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.success('Visitor checked out.');
          this.router.navigate(['/visitors/visits', this.visitId]);
        } else {
          this.toast.error(res.message || 'Check-out failed.');
        }
      },
      error: () => { this.isSaving = false; this.toast.error('Check-out failed.'); }
    });
  }

  onCancel(): void { this.router.navigate(['/visitors/visits']); }
}
