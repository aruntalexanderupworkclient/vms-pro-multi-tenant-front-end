import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceProxy } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { PHONE_PATTERN } from '@shared/constants/regex-patterns.constant';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authProxy: AuthServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.pattern(PHONE_PATTERN)]],
      tenantName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authProxy.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.toast.success('Registration successful! Please log in.');
          this.router.navigate(['/auth/login']);
        } else {
          this.toast.error(res.message || 'Registration failed.');
        }
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Something went wrong. Please try again.');
      }
    });
  }
}
