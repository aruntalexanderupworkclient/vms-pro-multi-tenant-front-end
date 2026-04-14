import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AuthServiceProxy } from '@service-proxy';
import { AuthService } from '@core/auth/auth.service';
import { ToastService } from '@core/services/toast.service';
import { emailValidator } from '@shared/utils/validators.utils';
import { APP_ROUTES } from '@shared/constants/menu.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  hidePassword = true;
  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authProxy: AuthServiceProxy,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authProxy.login({ email: email!, password: password! }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.handleLoginSuccess(response.data);
          this.toast.success('Welcome back, ' + response.data.user.fullName);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTES.DASHBOARD.fullPath;

          // Load menus before navigating so permissions are available immediately
          this.authService.loadMenus().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => this.router.navigateByUrl(returnUrl),
            error: () => this.router.navigateByUrl(returnUrl)
          });
        } else {
          this.toast.error(response.message || 'Login failed');
        }
      },
      error: () => {
        this.toast.error('Invalid email or password');
      }
    });
  }

  onGoogleLogin(): void {
    this.toast.info('Google login is not yet configured.');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
