import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleServiceProxy, RoleDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  isEditMode = false;
  roleId: string | null = null;
  isLoading = false;
  isSaving = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private roleProxy: RoleServiceProxy, private toast: ToastService) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.roleId;
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      isAdmin: [false],
      isActive: [true]
    });
    if (this.isEditMode) { this.loadRole(); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadRole(): void {
    this.isLoading = true;
    this.roleProxy.getById(this.roleId!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const r = res.data as RoleDto;
          this.form.patchValue({ name: r.name, description: r.description, isAdmin: r.isAdmin, isActive: r.isActive });
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load role.'); this.router.navigate(['/roles']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    if (this.isEditMode) {
      this.roleProxy.update(this.roleId!, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => { this.isSaving = false; if (res.success) { this.toast.success('Role updated.'); this.router.navigate(['/roles', this.roleId]); } else { this.toast.error(res.message || 'Update failed.'); } },
        error: () => { this.isSaving = false; this.toast.error('Failed to update role.'); }
      });
    } else {
      this.roleProxy.create(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => { this.isSaving = false; if (res.success) { this.toast.success('Role created.'); this.router.navigate(['/roles']); } else { this.toast.error(res.message || 'Create failed.'); } },
        error: () => { this.isSaving = false; this.toast.error('Failed to create role.'); }
      });
    }
  }

  onCancel(): void { this.router.navigate(['/roles']); }
}
