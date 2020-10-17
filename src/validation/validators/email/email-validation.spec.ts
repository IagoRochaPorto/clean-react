import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { EmailValidation } from './email-validation'
import faker from 'faker'

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const systemUnderTest = new EmailValidation(faker.random.word())
    const error = systemUnderTest.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falry if email is valid', () => {
    const systemUnderTest = new EmailValidation(faker.random.word())
    const error = systemUnderTest.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
