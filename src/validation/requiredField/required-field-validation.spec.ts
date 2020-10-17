import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/requiredField/required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty ', () => {
    const systemUnderSystem = new RequiredFieldValidation('email')
    const error = systemUnderSystem.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
})
