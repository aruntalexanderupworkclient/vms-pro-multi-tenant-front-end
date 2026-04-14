import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationServiceProxy, LocationDto } from '@service-proxy';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  locations: LocationDto[] = [];
  flatLocations: (LocationDto & { depth: number })[] = [];
  isLoading = true;
  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private router: Router,
    private locationProxy: LocationServiceProxy,
    private toast: ToastService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth.menus$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreate = this.auth.hasPermission('Locations', 'canCreate');
      this.canUpdate = this.auth.hasPermission('Locations', 'canUpdate');
      this.canDelete = this.auth.hasPermission('Locations', 'canDelete');
    });
    this.loadLocations();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadLocations(): void {
    this.isLoading = true;
    this.locationProxy.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.locations = res.data as LocationDto[];
          this.flatLocations = this.flatten(this.locations, 0);
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.toast.error('Failed to load locations.'); }
    });
  }

  private flatten(locs: LocationDto[], depth: number): (LocationDto & { depth: number })[] {
    const result: (LocationDto & { depth: number })[] = [];
    for (const loc of locs) {
      result.push({ ...loc, depth });
      if (loc.children && loc.children.length > 0) {
        result.push(...this.flatten(loc.children, depth + 1));
      }
    }
    return result;
  }

  onNew(): void { this.router.navigate(['/locations/new']); }
  onEdit(loc: LocationDto): void { this.router.navigate(['/locations', loc.id, 'edit']); }

  onDelete(loc: LocationDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Location', message: `Delete "${loc.name}"?`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.locationProxy.delete(loc.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => { if (res.success) { this.toast.success('Location deleted.'); this.loadLocations(); } else { this.toast.error(res.message || 'Delete failed.'); } },
          error: () => this.toast.error('Failed to delete location.')
        });
      }
    });
  }
}
