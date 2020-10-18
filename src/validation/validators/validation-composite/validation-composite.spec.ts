import { Validation } from '@/presentation/protocols/validation'
import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('any_field')
    fieldValidationSpy.error = new Error('first_error')
    const fieldValidationSpy2 = new FieldValidationSpy('any_field')
    fieldValidationSpy2.error = new Error('second_error')
    const systemUnderTest = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2])
    const error = systemUnderTest.validate('any_field', 'any_value')
    expect(error).toBe('first_error')
  })
})
