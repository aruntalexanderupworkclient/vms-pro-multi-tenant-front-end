import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisitorServiceProxy, VisitorDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-visitor-detail',
  templateUrl: './visitor-detail.component.html',
  styleUrls: ['./visitor-detail.component.scss']
})
export class VisitorDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  visitor: VisitorDto | null = null;
  isLoading = true;
  canUpdate = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitorProxy: VisitorServiceProxy,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canUpdate = this.auth.hasPermission('Visitors', 'canUpdate');
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVisitor(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVisitor(id: string): void {
    this.isLoading = true;
    this.visitorProxy.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.visitor = res.data as VisitorDto;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load visitor.');
        this.router.navigate(['/visitors']);
      }
    });
  }

  onEdit(): void {
    if (this.visitor) {
      this.router.navigate(['/visitors', this.visitor.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/visitors']);
  }
}
