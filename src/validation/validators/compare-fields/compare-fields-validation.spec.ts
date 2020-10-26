import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidFieldError } from '@/validation/errors'
import faker from 'faker'

const makeSystemUnderTest = (valueToCompare: string): CompareFieldsValidation =>
  new CompareFieldsValidation(faker.database.column(), valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid ', () => {
    const systemUnderSystem = makeSystemUnderTest(faker.random.word())
    const error = systemUnderSystem.validate(faker.random.word())

    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if compare is valid ', () => {
    const valueToCompare = faker.random.word()
    const systemUnderSystem = makeSystemUnderTest(valueToCompare)
    const error = systemUnderSystem.validate(valueToCompare)
    expect(error).toBeFalsy()
  })
})
