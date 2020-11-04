import React from 'react'
import faker from 'faker'
import { RenderResult, render, cleanup } from '@testing-library/react'
import SignUp from './signup'
import { Helper, ValidationStub } from '@/presentation/test'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
}

type SystemUnderTestParams = {
  validationError: string
}

const makeSystemUnderTest = (params?: SystemUnderTestParams): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError || ''

  const systemUnderTest = render(<SignUp validation={validationStub} />)
  return {
    systemUnderTest
  }
}

describe('Signup component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { systemUnderTest } = makeSystemUnderTest({ validationError })
    Helper.testChildCount(systemUnderTest, 'error-wrapper', 0)
    Helper.testButtonIsDisabled(systemUnderTest, 'submit', true)
    Helper.testStatusForField(systemUnderTest, 'name', validationError)
    Helper.testStatusForField(systemUnderTest, 'email', 'Campo obrigatório')
    Helper.testStatusForField(systemUnderTest, 'password', 'Campo obrigatório')
    Helper.testStatusForField(systemUnderTest, 'passwordConfirmation', 'Campo obrigatório')
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.populateField(systemUnderTest, 'name')
    Helper.testStatusForField(systemUnderTest, 'name', validationError)
  })
})
