// ============================================================
// VMS Pro — Document DTOs
// ============================================================

export interface DocumentDto {
  id: string;
  fileName: string;
  originalFileName: string | null;
  contentType: string | null;
  fileSize: number;
  entityTypeId: string | null;
  entityTypeName: string | null;
  fileTypeId: string | null;
  fileTypeName: string | null;
  entityId: string | null;
  description: string | null;
  createdAt: string;
}

export interface UploadDocumentDto {
  entityTypeId?: string;
  fileTypeId?: string;
  entityId?: string;
  description?: string;
}
