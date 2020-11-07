import { FieldValidationSpy } from '@/validation/test/'
import { ValidationComposite } from './validation-composite'
import faker from 'faker'
type SystemUnderTest = {
  systemUnderTest: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSystemUnderSystem = (fieldName: string): SystemUnderTest => {
  const fieldValidationsSpy = [new FieldValidationSpy(fieldName), new FieldValidationSpy(fieldName)]
  const systemUnderTest = ValidationComposite.build(fieldValidationsSpy)
  return {
    systemUnderTest,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { systemUnderTest, fieldValidationsSpy } = makeSystemUnderSystem(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    fieldValidationsSpy[1].error = new Error(faker.random.words())
    const error = systemUnderTest.validate(fieldName, { [fieldName]: faker.random.word() })
    expect(error).toBe(errorMessage)
  })

  test('Should return falsy if none validation fails', () => {
    const fieldName = faker.database.column()

    const { systemUnderTest } = makeSystemUnderSystem(fieldName)
    const error = systemUnderTest.validate(fieldName, { [fieldName]: 'any_value' })
    expect(error).toBeFalsy()
  })
})
