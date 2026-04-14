// ============================================================
// VMS Pro — Visitor DTOs
// ============================================================

export interface VisitorDto {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  photoUrl: string | null;
  idProofType: string | null;
  idProofNumber: string | null;
  isBlacklisted: boolean;
  createdAt: string;
}

export interface CreateVisitorDto {
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  idProofType?: string;
  idProofNumber?: string;
}

export interface UpdateVisitorDto {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  idProofType?: string;
  idProofNumber?: string;
  isBlacklisted?: boolean;
}
