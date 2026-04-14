// ============================================================
// VMS Pro — Validators Utilities
// ============================================================
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { EMAIL_PATTERN, PHONE_PATTERN, PASSWORD_PATTERN } from '@shared/constants/regex-patterns.constant';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    return EMAIL_PATTERN.test(control.value) ? null : { email: 'Invalid email format' };
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    return PHONE_PATTERN.test(control.value) ? null : { phone: 'Invalid phone number' };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    return PASSWORD_PATTERN.test(control.value)
      ? null
      : { passwordStrength: 'Password must have 8+ chars, uppercase, lowercase, digit, and special character' };
  };
}

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; }
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: 'Value cannot be only whitespace' } : null;
  };
}

export function matchFieldValidator(matchField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) { return null; }
    const matchControl = parent.get(matchField);
    if (!matchControl) { return null; }
    return control.value === matchControl.value ? null : { mismatch: `Must match ${matchField}` };
  };
}
