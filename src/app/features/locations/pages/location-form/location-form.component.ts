import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationServiceProxy, LocationDto, MdmServiceProxy, MdmItemDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  isEditMode = false;
  locationId: string | null = null;
  isLoading = false;
  isSaving = false;
  parentLocations: LocationDto[] = [];
  locationTypes: MdmItemDto[] = [];

  constructor(
    private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private locationProxy: LocationServiceProxy, private mdmProxy: MdmServiceProxy, private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.locationId;
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      code: [null],
      typeId: [null, Validators.required],
      parentId: [null],
      isActive: [true]
    });
    this.loadDropdowns();
    if (this.isEditMode) { this.loadLocation(); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadDropdowns(): void {
    this.locationProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.parentLocations = res.data as LocationDto[]; }
    });
    this.mdmProxy.getLocationTypes().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.locationTypes = res.data as MdmItemDto[]; }
    });
  }

  private loadLocation(): void {
    this.isLoading = true;
    this.locationProxy.getById(this.locationId!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const l = res.data as LocationDto;
          this.form.patchValue({ name: l.name, code: l.code, typeId: l.typeId, parentId: l.parentId, isActive: l.isActive });
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load location.'); this.router.navigate(['/locations']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    if (this.isEditMode) {
      this.locationProxy.update(this.locationId!, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => { this.isSaving = false; if (res.success) { this.toast.success('Location updated.'); this.router.navigate(['/locations']); } else { this.toast.error(res.message || 'Update failed.'); } },
        error: () => { this.isSaving = false; this.toast.error('Failed to update location.'); }
      });
    } else {
      this.locationProxy.create(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => { this.isSaving = false; if (res.success) { this.toast.success('Location created.'); this.router.navigate(['/locations']); } else { this.toast.error(res.message || 'Create failed.'); } },
        error: () => { this.isSaving = false; this.toast.error('Failed to create location.'); }
      });
    }
  }

  onCancel(): void { this.router.navigate(['/locations']); }
}
