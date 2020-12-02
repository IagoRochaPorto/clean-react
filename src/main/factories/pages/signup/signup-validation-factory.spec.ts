import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields/compare-fields-validation'
import { makeSignupValidation } from './signup-validation-factory'

describe('SignupValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignupValidation()
    expect(composite).toEqual(
      ValidationComposite.build([
        new RequiredFieldValidation('name'),
        new MinLengthValidation('name', 5),
        new RequiredFieldValidation('email'),
        new EmailValidation('email'),
        new RequiredFieldValidation('password'),
        new MinLengthValidation('password', 5),
        new RequiredFieldValidation('passwordConfirmation'),
        new CompareFieldsValidation('passwordConfirmation', 'password')
      ])
    )
  })
})
