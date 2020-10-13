import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string
  fieldValue: string
  validate(fieldName: string, fieldValue: string): string | null {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}
