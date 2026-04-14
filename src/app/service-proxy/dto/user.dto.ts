// ============================================================
// VMS Pro — User DTOs
// ============================================================

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  roleId: string | null;
  roleName: string | null;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  roleId?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  roleId?: string;
  isActive?: boolean;
}
