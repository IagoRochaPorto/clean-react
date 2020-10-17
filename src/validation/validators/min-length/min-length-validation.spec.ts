import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

const makeSystemUnderTest = (): MinLengthValidation => new MinLengthValidation(faker.database.column(), 5)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})
