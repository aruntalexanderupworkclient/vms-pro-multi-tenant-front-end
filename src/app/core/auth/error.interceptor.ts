// ============================================================
// VMS Pro — Error Interceptor
// ============================================================
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ToastService } from '@core/services/toast.service';
import { AuthServiceProxy, RefreshTokenRequest } from '@service-proxy';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private toast: ToastService,
    private authProxy: AuthServiceProxy,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            return this.handle401Error(request, next);
          case 403:
            this.toast.error('Access Denied: You do not have permission for this action.');
            break;
          case 404:
            this.toast.error('Resource not found.');
            break;
          case 400:
            this.handleValidationErrors(error);
            break;
          case 0:
            this.toast.error('Unable to connect to server. Please check your network.');
            break;
          default:
            if (error.status >= 500) {
              this.toast.error('An unexpected server error occurred. Please try again later.');
            }
            break;
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();

      if (refreshToken && !this.tokenService.isRefreshTokenExpired()) {
        const dto: RefreshTokenRequest = { refreshToken };

        return this.authProxy.refreshToken(dto).pipe(
          switchMap(response => {
            this.isRefreshing = false;
            if (response.success && response.data) {
              this.authService.handleLoginSuccess(response.data);
              this.refreshTokenSubject.next(response.data.accessToken);
              return next.handle(this.addToken(request, response.data.accessToken));
            }
            this.authService.logout();
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => err);
          })
        );
      } else {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => new Error('No refresh token available'));
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleValidationErrors(error: HttpErrorResponse): void {
    if (error.error?.message) {
      this.toast.error(error.error.message);
    } else {
      this.toast.error('Invalid request. Please check your input.');
    }
  }
}
