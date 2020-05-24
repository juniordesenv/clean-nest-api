import { ValidationOptions, ValidateIf } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions) {
  return ValidateIf((obj, value) => value !== null && value !== undefined && value !== '', validationOptions);
}
