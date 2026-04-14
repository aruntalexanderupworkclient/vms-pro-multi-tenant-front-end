// ============================================================
// VMS Pro — Main Layout Component
// ============================================================
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { SignalRService } from '@core/services/signalr.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarMode: 'expanded' | 'collapsed' | 'hidden' = 'expanded';

  constructor(
    private authService: AuthService,
    private signalRService: SignalRService,
  ) {}

  ngOnInit(): void {
    this.updateSidebarForScreenSize();
    this.loadMenus();
    this.signalRService.startConnection();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSidebarForScreenSize();
  }

  /** Whether we're on a mobile-sized viewport */
  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  /** Show overlay only when sidebar is expanded on mobile */
  get isMobileOverlayVisible(): boolean {
    return this.isMobile && this.sidebarMode === 'expanded';
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      // On mobile: toggle between hidden and expanded (overlay)
      this.sidebarMode = this.sidebarMode === 'expanded' ? 'hidden' : 'expanded';
    } else {
      // On desktop: cycle expanded → collapsed → hidden → expanded
      if (this.sidebarMode === 'expanded') {
        this.sidebarMode = 'collapsed';
      } else if (this.sidebarMode === 'collapsed') {
        this.sidebarMode = 'hidden';
      } else {
        this.sidebarMode = 'expanded';
      }
      localStorage.setItem('vms_sidebar_mode', this.sidebarMode);
    }
  }

  onSidebarModeChange(mode: 'expanded' | 'collapsed' | 'hidden'): void {
    this.sidebarMode = mode;
  }

  closeMobileOverlay(): void {
    if (this.isMobile) {
      this.sidebarMode = 'hidden';
    }
  }

  get contentMargin(): string {
    if (this.sidebarMode === 'expanded') { return '240px'; }
    if (this.sidebarMode === 'collapsed') { return '64px'; }
    return '0';
  }

  private updateSidebarForScreenSize(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.sidebarMode = 'hidden';
    } else if (width <= 1024) {
      this.sidebarMode = 'collapsed';
    } else {
      const saved = localStorage.getItem('vms_sidebar_mode');
      this.sidebarMode = (saved as any) || 'expanded';
    }
  }

  private loadMenus(): void {
    this.authService.loadMenus().pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.signalRService.stopConnection();
  }
}
