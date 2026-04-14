import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationServiceProxy, NotificationDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { PagedResult } from '@core/models/api-response.model';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: NotificationDto[] = [];
  isLoading = true;
  page = 1;
  pageSize = 20;
  totalPages = 0;

  constructor(
    private notificationProxy: NotificationServiceProxy,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadNotifications(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationProxy.getAll(this.page, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as PagedResult<NotificationDto>;
          this.notifications = data.items;
          this.totalPages = data.totalPages;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load notifications.'); }
    });
  }

  markAsRead(n: NotificationDto): void {
    if (n.readAt) { return; }
    this.notificationProxy.markAsRead(n.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { if (res.success) { n.readAt = new Date().toISOString(); } },
      error: () => {}
    });
  }

  onPageChange(p: number): void { this.page = p; this.loadNotifications(); }

  getChannelIcon(channel: string): string {
    switch (channel) {
      case 'Email': return 'email';
      case 'SMS': return 'sms';
      case 'WhatsApp': return 'chat';
      case 'InApp': return 'notifications';
      default: return 'notifications';
    }
  }
}
