import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { SignalRService, ConnectionStatus } from '@core/services/signalr.service';
import { UserInfo } from '@service-proxy';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  user: UserInfo | null = null;
  showDropdown = false;
  showProfileDrawer = false;

  /** SignalR connection status observable for the template */
  connectionStatus$: Observable<ConnectionStatus>;
  connectionStatus: ConnectionStatus = 'disconnected';
  private statusSub!: Subscription;

  /** Map of full URL paths to friendly page titles */
  private static readonly PAGE_TITLES: { [path: string]: string } = {
    '/dashboard':              'Dashboard',
    '/visitors':               'Visitor Directory',
    '/visitors/new':           'New Visitor',
    '/visitors/visits':        'Visit Schedule',
    '/visitors/visits/new':    'Schedule Visit',
    '/users':                  'Users',
    '/users/new':              'New User',
    '/roles':                  'Roles',
    '/roles/new':              'New Role',
    '/locations':              'Locations',
    '/locations/new':          'New Location',
    '/settings':               'Settings',
    '/settings/form-fields':   'Form Fields',
    '/settings/mdm':           'Master Data',
    '/reports':                'Reports',
    '/notifications':          'Notifications',
  };

  /** Map of last URL segment to friendly label */
  private static readonly SEGMENT_TITLES: { [seg: string]: string } = {
    'checkin':     'Check In',
    'checkout':    'Check Out',
    'edit':        'Edit',
    'permissions': 'Permissions',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {
    this.authService.currentUser$.subscribe(u => this.user = u);
    this.connectionStatus$ = this.signalRService.connectionStatus$;
  }

  ngOnInit(): void {
    this.statusSub = this.connectionStatus$.subscribe(
      status => this.connectionStatus = status
    );
    // Update title on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._pageTitle = this.resolvePageTitle();
    });
    this._pageTitle = this.resolvePageTitle();
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
  }

  get initials(): string {
    return this.user ? this.authService.getInitials(this.user.fullName) : '?';
  }

  _pageTitle = 'Dashboard';

  get pageTitle(): string {
    return this._pageTitle;
  }

  private resolvePageTitle(): string {
    const path = this.router.url.split('?')[0];
    // Check full-path map first
    if (TopbarComponent.PAGE_TITLES[path]) {
      return TopbarComponent.PAGE_TITLES[path];
    }
    // Build path without UUIDs and check again
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const segments = path.split('/').filter(s => s);
    const meaningful = segments.filter(s => !uuidPattern.test(s));
    const cleanPath = '/' + meaningful.join('/');
    if (TopbarComponent.PAGE_TITLES[cleanPath]) {
      return TopbarComponent.PAGE_TITLES[cleanPath];
    }
    // Check last segment in segment titles
    if (meaningful.length > 0) {
      const last = meaningful[meaningful.length - 1];
      if (TopbarComponent.SEGMENT_TITLES[last]) {
        return TopbarComponent.SEGMENT_TITLES[last];
      }
      return last.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Dashboard';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  openProfile(): void {
    this.showDropdown = false;
    this.showProfileDrawer = true;
  }

  logout(): void {
    this.authService.logout();
  }

  /** Human-friendly label for the connection status */
  get statusLabel(): string {
    switch (this.connectionStatus) {
      case 'connected': return 'Live';
      case 'reconnecting': return 'Reconnecting…';
      default: return 'Offline';
    }
  }

  /** Tooltip text for connection status */
  get statusTooltip(): string {
    switch (this.connectionStatus) {
      case 'connected': return 'Real-time: Connected';
      case 'reconnecting': return 'Real-time: Reconnecting…';
      default: return 'Real-time: Disconnected';
    }
  }
}
