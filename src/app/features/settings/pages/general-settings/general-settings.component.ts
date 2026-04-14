import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsServiceProxy, GeneralSettingsDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  settings: GeneralSettingsDto = {
    companyName: '',
    timezone: '',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    autoCheckoutHours: 8
  };

  isLoading = true;
  isSaving = false;

  dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  languages = ['English', 'Hindi', 'Spanish', 'French', 'Arabic'];

  constructor(
    private settingsProxy: SettingsServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.settingsProxy.getGeneralSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.settings = res.data;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to load general settings.');
        }
      });
  }

  onSave(): void {
    this.isSaving = true;
    this.settingsProxy.updateGeneralSettings(this.settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.toast.success('General settings saved successfully.');
          } else {
            this.toast.error(res.message || 'Save failed.');
          }
        },
        error: () => {
          this.isSaving = false;
          this.toast.error('Failed to save general settings.');
        }
      });
  }
}
