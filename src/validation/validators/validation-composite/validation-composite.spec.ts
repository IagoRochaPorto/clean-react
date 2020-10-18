import { Validation } from '@/presentation/protocols/validation'
import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('any_field')
    const fieldValidationSpy2 = new FieldValidationSpy('any_field')
    fieldValidationSpy2.error = new Error('any_error_message')
    const systemUnderTest = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2])
    const error = systemUnderTest.validate('any_field', 'any_value')
    expect(error).toBe('any_error_message')
  })
})
