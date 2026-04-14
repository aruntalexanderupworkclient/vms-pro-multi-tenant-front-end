// ============================================================
// VMS Pro — Has Permission Directive
// Usage: *hasPermission="['Visitors', 'CanCreate']"
// ============================================================
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective implements OnInit {
  @Input('hasPermission') permission: [string, string] = ['', ''];

  private isRendered = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const [menuName, permissionType] = this.permission;
    const hasAccess = this.authService.hasPermission(
      menuName,
      this.mapPermission(permissionType)
    );

    if (hasAccess && !this.isRendered) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isRendered = true;
    } else if (!hasAccess && this.isRendered) {
      this.viewContainer.clear();
      this.isRendered = false;
    }
  }

  private mapPermission(perm: string): 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canPrint' {
    const map: Record<string, 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canPrint'> = {
      CanCreate: 'canCreate', CanRead: 'canRead', CanUpdate: 'canUpdate',
      CanDelete: 'canDelete', CanPrint: 'canPrint',
      canCreate: 'canCreate', canRead: 'canRead', canUpdate: 'canUpdate',
      canDelete: 'canDelete', canPrint: 'canPrint',
    };
    return map[perm] || 'canRead';
  }
}
