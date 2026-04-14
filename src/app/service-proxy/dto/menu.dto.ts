// ============================================================
// VMS Pro — Menu DTOs
// ============================================================

export interface MenuDto {
  id: string;
  name: string;
  icon: string | null;
  route: string | null;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  children: MenuDto[];
}

export interface MenuWithPermissionDto {
  menuId: string;
  menuName: string;
  icon: string | null;
  route: string | null;
  parentId: string | null;
  displayOrder: number;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
  children: MenuWithPermissionDto[];
}

export interface CreateMenuDto {
  name: string;
  icon?: string;
  route?: string;
  parentId?: string;
  displayOrder: number;
}

export interface UpdateMenuDto {
  name?: string;
  icon?: string;
  route?: string;
  parentId?: string;
  displayOrder?: number;
  isActive?: boolean;
}
