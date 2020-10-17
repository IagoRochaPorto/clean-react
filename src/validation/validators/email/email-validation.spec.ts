import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { EmailValidation } from './email-validation'
import faker from 'faker'

const makeSystemUnderTest = (): EmailValidation => new EmailValidation(faker.database.column())

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falry if email is valid', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
