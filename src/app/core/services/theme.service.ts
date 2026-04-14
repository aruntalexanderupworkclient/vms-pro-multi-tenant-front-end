// ============================================================
// VMS Pro — Theme Service
// ============================================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const THEME_KEY = 'vms_theme';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getStoredTheme());
  theme$: Observable<ThemeMode> = this.themeSubject.asObservable();

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  toggleTheme(): void {
    const newTheme: ThemeMode = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
