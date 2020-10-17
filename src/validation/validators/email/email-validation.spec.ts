import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { EmailValidation } from './email-validation'

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const systemUnderTest = new EmailValidation('email')
    const error = systemUnderTest.validate('')
    expect(error).toEqual(new InvalidFieldError())
  })
})
