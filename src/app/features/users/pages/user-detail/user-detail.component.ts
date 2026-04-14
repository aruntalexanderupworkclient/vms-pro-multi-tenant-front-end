import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceProxy, UserDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: UserDto | null = null;
  isLoading = true;
  canUpdate = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userProxy: UserServiceProxy,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canUpdate = this.auth.hasPermission('Users', 'canUpdate');
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.loadUser(id); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.userProxy.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { if (res.success && res.data) { this.user = res.data as UserDto; } this.isLoading = false; },
      error: () => { this.isLoading = false; this.toast.error('Failed to load user.'); this.router.navigate(['/users']); }
    });
  }

  onEdit(): void { if (this.user) { this.router.navigate(['/users', this.user.id, 'edit']); } }
  onBack(): void { this.router.navigate(['/users']); }
}
