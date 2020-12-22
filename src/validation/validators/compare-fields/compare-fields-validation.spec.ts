import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidFieldError } from '@/validation/errors'
import faker from 'faker'

const makeSystemUnderTest = (field: string, fieldToCompare: string): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid ', () => {
    const field = 'any_field'
    const fieldToCompare = 'other_field'
    const systemUnderTest = makeSystemUnderTest(field, fieldToCompare)
    const error = systemUnderTest.validate({
      [field]: 'any_value',
      [fieldToCompare]: 'other_value'
    })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if compare is valid ', () => {
    const field = 'any_field'
    const fieldToCompare = 'other_field'
    const value = faker.random.word()
    const systemUnderTest = makeSystemUnderTest(field, fieldToCompare)
    const error = systemUnderTest.validate({ [field]: value, [fieldToCompare]: value })
    expect(error).toBeFalsy()
  })
})
