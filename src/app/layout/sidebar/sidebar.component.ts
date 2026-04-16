import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { APP_ROUTES } from '@shared/constants/menu.constants';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  section?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  expanded?: boolean;
  menuName?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() mode: 'expanded' | 'collapsed' | 'hidden' = 'expanded';
  @Output() modeChange = new EventEmitter<'expanded' | 'collapsed' | 'hidden'>();

  currentRoute = '';

  menuItems: MenuItem[] = [
    { label: APP_ROUTES.DASHBOARD.menu.name, icon: APP_ROUTES.DASHBOARD.menu.icon, route: APP_ROUTES.DASHBOARD.fullPath, menuName: APP_ROUTES.DASHBOARD.menu.name },
    {
      label: APP_ROUTES.VISITORS.menu.name,
      icon: APP_ROUTES.VISITORS.menu.icon,
      route: '',
      menuName: 'Visitors',
      expanded: false,
      children: APP_ROUTES.VISITORS.menu.subMenus!.map(sub => ({
        label: sub.name,
        icon: sub.icon,
        route: sub.route,
        menuName: 'Visitors',
      })),
    },
    { label: APP_ROUTES.USERS.menu.name, icon: APP_ROUTES.USERS.menu.icon, route: APP_ROUTES.USERS.fullPath, menuName: APP_ROUTES.USERS.menu.name },
    { label: APP_ROUTES.ROLES.menu.name, icon: APP_ROUTES.ROLES.menu.icon, route: APP_ROUTES.ROLES.fullPath, menuName: APP_ROUTES.ROLES.menu.name },
    { label: APP_ROUTES.LOCATIONS.menu.name, icon: APP_ROUTES.LOCATIONS.menu.icon, route: APP_ROUTES.LOCATIONS.fullPath, menuName: APP_ROUTES.LOCATIONS.menu.name },
    { label: '', icon: '', route: '', divider: true },
    { label: APP_ROUTES.SETTINGS.menu.name, icon: APP_ROUTES.SETTINGS.menu.icon, route: APP_ROUTES.SETTINGS.fullPath, menuName: APP_ROUTES.SETTINGS.menu.name },
    { label: APP_ROUTES.REPORTS.menu.name, icon: APP_ROUTES.REPORTS.menu.icon, route: APP_ROUTES.REPORTS.fullPath, menuName: APP_ROUTES.REPORTS.menu.name },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.autoExpandActiveParent();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects || event.url;
      this.autoExpandActiveParent();
    });
  }

  isActive(route: string): boolean {
    if (!route) { return false; }
    return this.currentRoute.startsWith(route);
  }

  /** Check if a sub-menu item is the active route (exact segment match) */
  isSubMenuActive(child: MenuItem, siblings: MenuItem[]): boolean {
    if (!child.route) { return false; }
    // Sort siblings by route length descending so longer/more-specific routes match first
    const sorted = [...siblings].sort((a, b) => b.route.length - a.route.length);
    for (const sibling of sorted) {
      if (this.currentRoute.startsWith(sibling.route)) {
        return sibling.route === child.route;
      }
    }
    return false;
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) { return false; }
    return item.children.some(child => this.currentRoute.startsWith(child.route));
  }

  toggleExpand(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  /** Auto-expand parent menu when navigating to a child route */
  private autoExpandActiveParent(): void {
    for (const item of this.menuItems) {
      if (item.children && this.isParentActive(item)) {
        item.expanded = true;
      }
    }
  }

  navigate(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  onMenuClick(event: MouseEvent, route: string): void {
    if (event.ctrlKey || event.metaKey) {
      // Allow default browser behavior (open in new tab via routerLink/href)
      return;
    }
    event.preventDefault();
    this.navigate(route);
  }

  onMiddleClick(event: MouseEvent, route: string): void {
    if (event.button === 1 && route) {
      event.preventDefault();
      window.open(route, '_blank');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  hasMenuAccess(item: MenuItem): boolean {
    if (!item.menuName) { return true; }
    return this.authService.hasPermission(item.menuName, 'canRead');
  }
}
