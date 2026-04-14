import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  VisitServiceProxy, VisitorServiceProxy, UserServiceProxy, LocationServiceProxy,
  VisitorDto, UserDto, LocationDto
} from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isSaving = false;
  visitors: VisitorDto[] = [];
  hosts: UserDto[] = [];
  locations: LocationDto[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private visitProxy: VisitServiceProxy,
    private visitorProxy: VisitorServiceProxy,
    private userProxy: UserServiceProxy,
    private locationProxy: LocationServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      visitorId: ['', Validators.required],
      hostId: ['', Validators.required],
      locationId: [''],
      purpose: [''],
      scheduledDateTime: ['', Validators.required],
      remarks: ['']
    });

    this.loadDropdowns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDropdowns(): void {
    this.visitorProxy.getAll(1, 200).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.visitors = res.data.items; }
    });
    this.userProxy.getAll(1, 200).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.hosts = res.data.items; }
    });
    this.locationProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.locations = res.data as LocationDto[]; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isSaving = true;
    const val = this.form.value;
    // Convert date to ISO string
    val.scheduledDateTime = new Date(val.scheduledDateTime).toISOString();

    this.visitProxy.create(val).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.success('Visit scheduled.');
          this.router.navigate(['/visitors/visits']);
        } else {
          this.toast.error(res.message || 'Failed to schedule visit.');
        }
      },
      error: () => { this.isSaving = false; this.toast.error('Failed to schedule visit.'); }
    });
  }

  onCancel(): void { this.router.navigate(['/visitors/visits']); }
}
