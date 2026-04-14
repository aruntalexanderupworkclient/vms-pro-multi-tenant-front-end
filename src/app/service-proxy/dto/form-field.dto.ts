// ============================================================
// VMS Pro — Form Field DTOs
// ============================================================

export interface FormFieldDto {
  id: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  displayOrder: number;
  defaultValue: string | null;
  options: string | null;
  validationRegex: string | null;
  planTypeId: string | null;
  isActive: boolean;
  isSystemField: boolean;
}

export interface CreateFormFieldDto {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired?: boolean;
  displayOrder: number;
  defaultValue?: string;
  options?: string;
  validationRegex?: string;
  planTypeId?: string;
}

export interface UpdateFormFieldDto {
  fieldLabel?: string;
  fieldType?: string;
  isRequired?: boolean;
  displayOrder?: number;
  defaultValue?: string;
  options?: string;
  validationRegex?: string;
  isActive?: boolean;
}
