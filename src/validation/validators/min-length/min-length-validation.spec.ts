import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { MinLengthValidation } from './min-length-validation'

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const systemUnderTest = new MinLengthValidation('field', 5)
    const error = systemUnderTest.validate('123')
    expect(error).toEqual(new InvalidFieldError())
  })
})
