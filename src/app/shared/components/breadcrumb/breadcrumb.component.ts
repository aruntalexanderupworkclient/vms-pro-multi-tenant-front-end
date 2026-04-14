// ============================================================
// VMS Pro — Breadcrumb Component
// ============================================================
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

/** Map of URL paths to friendly breadcrumb labels */
const BREADCRUMB_LABELS: { [path: string]: string } = {
  '/dashboard':        'Dashboard',
  '/visitors':         'Visitor Directory',
  '/visitors/new':     'New',
  '/visitors/visits':  'Visit Schedule',
  '/visitors/visits/new': 'New',
  '/users':            'Users',
  '/users/new':        'New',
  '/roles':            'Roles',
  '/roles/new':        'New',
  '/locations':        'Locations',
  '/locations/new':    'New',
  '/settings':         'Settings',
  '/settings/form-fields':     'Form Fields',
  '/settings/form-fields/new': 'New',
  '/settings/mdm':     'Master Data',
  '/reports':          'Reports',
  '/notifications':    'Notifications',
};

/** Map of URL segment to friendly labels for action segments */
const SEGMENT_LABELS: { [key: string]: string } = {
  'checkin':     'Check In',
  'checkout':    'Check Out',
  'edit':        'Edit',
  'permissions': 'Permissions',
  'new':         'New',
};

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs();
    });
    this.breadcrumbs = this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): Breadcrumb[] {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(s => s);
    const crumbs: Breadcrumb[] = [{ label: 'Home', url: '/dashboard' }];
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Always add "Visitor Management" as parent when under /visitors
    if (segments[0] === 'visitors') {
      crumbs.push({ label: 'Visitor Management', url: '/visitors' });
    }

    let path = '';
    for (const seg of segments) {
      path += '/' + seg;
      // Skip UUID/GUID segments
      if (uuidPattern.test(seg)) { continue; }
      // Skip the raw first segment if we already added a parent label for it
      if (path === '/' + segments[0] && segments[0] === 'visitors') { continue; }

      // Use the full-path label map first
      if (BREADCRUMB_LABELS[path]) {
        crumbs.push({ label: BREADCRUMB_LABELS[path], url: path });
      } else if (SEGMENT_LABELS[seg]) {
        // Use segment-level label for action segments
        crumbs.push({ label: SEGMENT_LABELS[seg], url: path });
      } else {
        // Fallback: capitalize the segment
        const label = seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        crumbs.push({ label, url: path });
      }
    }
    return crumbs;
  }
}
