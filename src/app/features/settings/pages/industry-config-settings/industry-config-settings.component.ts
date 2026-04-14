import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsServiceProxy, IndustryConfigDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-industry-config-settings',
  templateUrl: './industry-config-settings.component.html',
  styleUrls: ['./industry-config-settings.component.scss']
})
export class IndustryConfigSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: IndustryConfigDto = {
    orgType: 'Corporate Office',
    requirePhoto: true,
    requireIdScan: false,
    maxVisitDuration: 8,
    enableTokens: true,
    enableAppointments: true
  };

  isLoading = true;
  isSaving = false;

  orgTypes = ['Hospital', 'Residential Tower', 'Corporate Office', 'Factory', 'Educational Institute'];

  constructor(
    private settingsProxy: SettingsServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConfig(): void {
    this.isLoading = true;
    this.settingsProxy.getIndustryConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.config = res.data;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to load industry configuration.');
        }
      });
  }

  onSave(): void {
    this.isSaving = true;
    this.settingsProxy.updateIndustryConfig(this.config)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.toast.success('Industry configuration saved successfully.');
          } else {
            this.toast.error(res.message || 'Save failed.');
          }
        },
        error: () => {
          this.isSaving = false;
          this.toast.error('Failed to save industry configuration.');
        }
      });
  }
}
