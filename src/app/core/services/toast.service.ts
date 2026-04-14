// ============================================================
// VMS Pro — Toast Service
// ============================================================
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 6000,
      panelClass: ['snackbar-error'],
    });
  }

  warning(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-warning'],
    });
  }

  info(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-info'],
    });
  }
}
