// ============================================================
// VMS Pro — Form Utilities
// ============================================================
import { FormGroup } from '@angular/forms';

export function markAllAsTouched(form: FormGroup): void {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    control?.markAsTouched();
    control?.markAsDirty();
    if (control instanceof FormGroup) {
      markAllAsTouched(control);
    }
  });
}

export function getFormErrors(form: FormGroup): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    if (control?.errors) {
      errors[key] = Object.keys(control.errors).map(errorKey => {
        const errorValue = control.errors?.[errorKey];
        if (typeof errorValue === 'string') { return errorValue; }
        switch (errorKey) {
          case 'required': return `${key} is required`;
          case 'minlength': return `${key} must be at least ${errorValue.requiredLength} characters`;
          case 'maxlength': return `${key} must be at most ${errorValue.requiredLength} characters`;
          case 'email': return 'Invalid email format';
          case 'pattern': return `${key} has invalid format`;
          default: return `${key} is invalid`;
        }
      });
    }
  });
  return errors;
}
