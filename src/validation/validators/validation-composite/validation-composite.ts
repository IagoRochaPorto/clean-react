import { Validation } from '@/presentation/protocols/validation'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validators)
  }

  validate(fieldName: string, input: object): string {
    const selectedValidators = this.validators.filter((validator) => validator.field === fieldName)
    for (const validator of selectedValidators) {
      const error = validator.validate(input)
      if (error) return error.message
    }
  }
}
