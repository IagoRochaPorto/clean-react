import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/validators/required-field/required-field-validation'
import faker from 'faker'

const makeSystemUnderTest = (field: string): RequiredFieldValidation => new RequiredFieldValidation(field)

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty ', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const error = systemUnderTest.validate({ [field]: '' })
    expect(error).toEqual(new RequiredFieldError())
  })

  test('Should return falsy if field is not empty ', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const error = systemUnderTest.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
