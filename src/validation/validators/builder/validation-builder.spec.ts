import { RequiredFieldValidation } from '@/validation/validators'
import { ValidationBuilder as SystemUnderTest } from './validation-builder'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = SystemUnderTest.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })
})
