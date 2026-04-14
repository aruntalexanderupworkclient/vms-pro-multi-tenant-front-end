import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceProxy, RoleServiceProxy, UserDto, RoleDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  isLoading = false;
  isSaving = false;
  roles: RoleDto[] = [];
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userProxy: UserServiceProxy,
    private roleProxy: RoleServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      phone: [''],
      roleId: [''],
      isActive: [true]
    });

    if (this.isEditMode) {
      this.form.get('email')?.disable();
    }

    this.loadRoles();
    if (this.isEditMode) { this.loadUser(); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadRoles(): void {
    this.roleProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success && res.data) { this.roles = res.data as RoleDto[]; }
    });
  }

  private loadUser(): void {
    this.isLoading = true;
    this.userProxy.getById(this.userId!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const u = res.data as UserDto;
          this.form.patchValue({ fullName: u.fullName, email: u.email, phone: u.phone, roleId: u.roleId, isActive: u.isActive });
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load user.'); this.router.navigate(['/users']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const val = this.form.getRawValue();

    if (this.isEditMode) {
      const { password, email, ...updateDto } = val;
      this.userProxy.update(this.userId!, updateDto).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) { this.toast.success('User updated.'); this.router.navigate(['/users', this.userId]); }
          else { this.toast.error(res.message || 'Update failed.'); }
        },
        error: () => { this.isSaving = false; this.toast.error('Failed to update user.'); }
      });
    } else {
      this.userProxy.create(val).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) { this.toast.success('User created.'); this.router.navigate(['/users']); }
          else { this.toast.error(res.message || 'Create failed.'); }
        },
        error: () => { this.isSaving = false; this.toast.error('Failed to create user.'); }
      });
    }
  }

  onCancel(): void { this.router.navigate(['/users']); }
}
