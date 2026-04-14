// ============================================================
// VMS Pro — Role DTOs
// ============================================================

export interface RoleDto {
  id: string;
  name: string;
  description: string | null;
  isAdmin: boolean;
  isActive: boolean;
  permissions: RolePermissionDto[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isAdmin?: boolean;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  isAdmin?: boolean;
  isActive?: boolean;
}

export interface RolePermissionDto {
  menuId: string;
  menuName: string | null;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

export interface SetRolePermissionsDto {
  permissions: RolePermissionDto[];
}
