// ============================================================
// VMS Pro — Location DTOs
// ============================================================

export interface LocationDto {
  id: string;
  name: string;
  code: string | null;
  typeId: string | null;
  typeName: string | null;
  parentId: string | null;
  parentName: string | null;
  level: number;
  isActive: boolean;
  children: LocationDto[];
}

export interface CreateLocationDto {
  name: string;
  code?: string;
  typeId?: string;
  parentId?: string;
}

export interface UpdateLocationDto {
  name?: string;
  code?: string;
  typeId?: string;
  parentId?: string;
  isActive?: boolean;
}
