import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/requiredField/required-field-validation'
import faker from 'faker'

const makeSystemUnderTest = (): RequiredFieldValidation => new RequiredFieldValidation(faker.database.column())

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty ', () => {
    const systemUnderSystem = makeSystemUnderTest()
    const error = systemUnderSystem.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })

  test('Should return falsy if field is not empty ', () => {
    const systemUnderSystem = makeSystemUnderTest()
    const error = systemUnderSystem.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
