import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidFieldError } from '@/validation/errors'
import faker from 'faker'

const makeSystemUnderTest = (field: string, fieldToCompare: string): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid ', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const systemUnderSystem = makeSystemUnderTest(field, fieldToCompare)
    const error = systemUnderSystem.validate({
      [field]: 'any_value',
      [fieldToCompare]: 'other_value'
    })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if compare is valid ', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const value = faker.random.word()
    const systemUnderSystem = makeSystemUnderTest(field, fieldToCompare)
    const error = systemUnderSystem.validate({ [field]: value, [fieldToCompare]: value })
    expect(error).toBeFalsy()
  })
})
