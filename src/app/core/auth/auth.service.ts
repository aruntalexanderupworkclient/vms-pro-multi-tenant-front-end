// ============================================================
// VMS Pro — Auth Service
// ============================================================
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { TokenService } from './token.service';
import { UserInfo, LoginResponse, MenuWithPermissionDto, MenuServiceProxy } from '@service-proxy';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  currentUser$: Observable<UserInfo | null> = this.currentUserSubject.asObservable();

  private menusSubject = new BehaviorSubject<MenuWithPermissionDto[]>([]);
  menus$: Observable<MenuWithPermissionDto[]> = this.menusSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private menuProxy: MenuServiceProxy,
  ) {
    this.loadUserFromStorage();
  }

  get currentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.isAdmin ?? false;
  }

  get menus(): MenuWithPermissionDto[] {
    return this.menusSubject.value;
  }

  handleLoginSuccess(response: LoginResponse): void {
    this.tokenService.setTokens(
      response.accessToken,
      response.refreshToken,
      response.accessTokenExpiresAt,
      response.refreshTokenExpiresAt
    );
    this.setUser(response.user);
  }

  setUser(user: UserInfo): void {
    localStorage.setItem('vms_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  setMenus(menus: MenuWithPermissionDto[]): void {
    localStorage.setItem('vms_menus', JSON.stringify(menus));
    this.menusSubject.next(menus);
  }

  /** Fetch menus from API and store them. Returns observable for chaining. */
  loadMenus(): Observable<MenuWithPermissionDto[]> {
    return this.menuProxy.getMyMenus().pipe(
      map(res => (res.success && res.data) ? res.data : []),
      tap(menus => this.setMenus(menus)),
      catchError(() => {
        this.setMenus([]);
        return of([] as MenuWithPermissionDto[]);
      })
    );
  }

  getInitials(name: string): string {
    if (!name) { return '?'; }
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  logout(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem('vms_user');
    localStorage.removeItem('vms_menus');
    this.currentUserSubject.next(null);
    this.menusSubject.next([]);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  hasPermission(menuName: string, permission: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canPrint'): boolean {
    if (this.isAdmin) { return true; }
    const menus = this.menusSubject.value;
    const menu = this.findMenuRecursive(menus, menuName);
    return menu ? menu[permission] : false;
  }

  private findMenuRecursive(menus: MenuWithPermissionDto[], menuName: string): MenuWithPermissionDto | null {
    for (const menu of menus) {
      if (menu.menuName?.toLowerCase() === menuName.toLowerCase()) {
        return menu;
      }
      if (menu.children && menu.children.length > 0) {
        const found = this.findMenuRecursive(menu.children, menuName);
        if (found) { return found; }
      }
    }
    return null;
  }

  private loadUserFromStorage(): void {
    if (this.tokenService.isAuthenticated()) {
      const userJson = localStorage.getItem('vms_user');
      const menusJson = localStorage.getItem('vms_menus');

      if (userJson) {
        try {
          const user: UserInfo = JSON.parse(userJson);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch {
          this.logout();
        }
      }

      if (menusJson) {
        try {
          const menus: MenuWithPermissionDto[] = JSON.parse(menusJson);
          this.menusSubject.next(menus);
        } catch {
          // ignore
        }
      }
    }
  }
}
