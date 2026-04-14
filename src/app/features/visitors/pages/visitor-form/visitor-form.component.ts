import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitorServiceProxy, VisitorDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-visitor-form',
  templateUrl: './visitor-form.component.html',
  styleUrls: ['./visitor-form.component.scss']
})
export class VisitorFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEditMode = false;
  visitorId: string | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private visitorProxy: VisitorServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.visitorId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.visitorId;

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: [''],
      company: [''],
      idProofType: [''],
      idProofNumber: [''],
      isBlacklisted: [false]
    });

    if (this.isEditMode) {
      this.loadVisitor();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVisitor(): void {
    this.isLoading = true;
    this.visitorProxy.getById(this.visitorId!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const v = res.data as VisitorDto;
          this.form.patchValue({
            fullName: v.fullName,
            email: v.email,
            phone: v.phone,
            company: v.company,
            idProofType: v.idProofType,
            idProofNumber: v.idProofNumber,
            isBlacklisted: v.isBlacklisted
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load visitor.');
        this.router.navigate(['/visitors']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.form.value;

    if (this.isEditMode) {
      this.visitorProxy.update(this.visitorId!, val).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.toast.success('Visitor updated.');
            this.router.navigate(['/visitors', this.visitorId]);
          } else {
            this.toast.error(res.message || 'Update failed.');
          }
        },
        error: () => { this.isSaving = false; this.toast.error('Failed to update visitor.'); }
      });
    } else {
      this.visitorProxy.create(val).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.toast.success('Visitor created.');
            this.router.navigate(['/visitors']);
          } else {
            this.toast.error(res.message || 'Create failed.');
          }
        },
        error: () => { this.isSaving = false; this.toast.error('Failed to create visitor.'); }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/visitors']);
  }
}
