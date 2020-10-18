import { Validation } from '@/presentation/protocols/validation'
import { FieldValidation } from '@/validation/protocols/field-validation'
import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

type SystemUnderTest = {
  systemUnderTest: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSystemUnderSystem = (): SystemUnderTest => {
  const fieldValidationsSpy = [new FieldValidationSpy('any_field'), new FieldValidationSpy('any_field')]
  const systemUnderTest = new ValidationComposite(fieldValidationsSpy)
  return {
    systemUnderTest,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const { systemUnderTest, fieldValidationsSpy } = makeSystemUnderSystem()
    fieldValidationsSpy[0].error = new Error('first_error')
    fieldValidationsSpy[1].error = new Error('second_error')
    const error = systemUnderTest.validate('any_field', 'any_value')
    expect(error).toBe('first_error')
  })
})
