import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { EmailValidation } from './email-validation'
import faker from 'faker'

const makeSystemUnderTest = (field: string): EmailValidation => new EmailValidation(field)

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const error = systemUnderTest.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if email is valid', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const error = systemUnderTest.validate({ [field]: faker.internet.email() })
    expect(error).toBeFalsy()
  })

  test('Should return falsy if email is empty', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const error = systemUnderTest.validate({ [field]: '' })
    expect(error).toBeFalsy()
  })
})
