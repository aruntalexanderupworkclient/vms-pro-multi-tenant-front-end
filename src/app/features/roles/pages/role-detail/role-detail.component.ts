import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleServiceProxy, RoleDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  role: RoleDto | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private roleProxy: RoleServiceProxy, private toast: ToastService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.loadRole(id); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private loadRole(id: string): void {
    this.roleProxy.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { if (res.success && res.data) { this.role = res.data as RoleDto; } this.isLoading = false; },
      error: () => { this.isLoading = false; this.toast.error('Failed to load role.'); this.router.navigate(['/roles']); }
    });
  }

  onEdit(): void { if (this.role) { this.router.navigate(['/roles', this.role.id, 'edit']); } }
  onPermissions(): void { if (this.role) { this.router.navigate(['/roles', this.role.id, 'permissions']); } }
  onBack(): void { this.router.navigate(['/roles']); }
}
