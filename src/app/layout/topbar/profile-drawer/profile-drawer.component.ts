import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceProxy, UserDto } from '@service-proxy';
import { AuthService } from '@core/auth/auth.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-profile-drawer',
  templateUrl: './profile-drawer.component.html',
  styleUrls: ['./profile-drawer.component.scss']
})
export class ProfileDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  profileForm!: FormGroup;
  loading = false;
  saving = false;
  user: UserDto | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceProxy,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.loadProfile();
    }
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onOverlayClick(event: MouseEvent): void {
    // Close only if clicking the overlay backdrop itself
    if ((event.target as HTMLElement).classList.contains('drawer-overlay')) {
      this.close();
    }
  }

  save(): void {
    if (this.profileForm.invalid || !this.user) return;

    this.saving = true;
    const { fullName, phone } = this.profileForm.value;

    this.userService.update(this.user.id, { fullName, phone }).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.toast.success('Profile updated successfully');
          // Update the stored user info so topbar reflects the new name
          const currentUser = this.authService.currentUser;
          if (currentUser) {
            this.authService.setUser({ ...currentUser, fullName });
          }
          if (res.data) {
            this.user = res.data;
          }
        } else {
          this.toast.error(res.message || 'Failed to update profile');
        }
      },
      error: () => {
        this.saving = false;
        this.toast.error('Failed to update profile');
      }
    });
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['']
    });
  }

  private loadProfile(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.loading = true;
    this.userService.getById(userId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.user = res.data;
          this.profileForm.patchValue({
            fullName: res.data.fullName,
            phone: res.data.phone || ''
          });
        } else {
          this.toast.error('Failed to load profile');
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load profile');
      }
    });
  }
}
