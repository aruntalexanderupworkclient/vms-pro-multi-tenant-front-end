import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsServiceProxy, NotificationTemplateDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-notification-template-settings',
  templateUrl: './notification-template-settings.component.html',
  styleUrls: ['./notification-template-settings.component.scss']
})
export class NotificationTemplateSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  templates: NotificationTemplateDto[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private settingsProxy: SettingsServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.settingsProxy.getNotificationTemplates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.templates = res.data;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to load notification templates.');
        }
      });
  }

  onToggle(tmpl: NotificationTemplateDto): void {
    tmpl.enabled = !tmpl.enabled;
  }

  onSave(): void {
    this.isSaving = true;
    this.settingsProxy.updateNotificationTemplates(this.templates)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.toast.success('Notification templates saved successfully.');
          } else {
            this.toast.error(res.message || 'Save failed.');
          }
        },
        error: () => {
          this.isSaving = false;
          this.toast.error('Failed to save notification templates.');
        }
      });
  }
}
