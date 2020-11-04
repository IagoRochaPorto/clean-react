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
    Helper.testStatusForField(systemUnderTest, 'email', validationError)
    Helper.testStatusForField(systemUnderTest, 'password', validationError)
    Helper.testStatusForField(systemUnderTest, 'passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.populateField(systemUnderTest, 'name')
    Helper.testStatusForField(systemUnderTest, 'name', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.populateField(systemUnderTest, 'email')
    Helper.testStatusForField(systemUnderTest, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.populateField(systemUnderTest, 'password')
    Helper.testStatusForField(systemUnderTest, 'password', validationError)
  })

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.populateField(systemUnderTest, 'passwordConfirmation')
    Helper.testStatusForField(systemUnderTest, 'passwordConfirmation', validationError)
  })

  test('Should show valid name state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'name')
    Helper.testStatusForField(systemUnderTest, 'name')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'email')
    Helper.testStatusForField(systemUnderTest, 'email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'password')
    Helper.testStatusForField(systemUnderTest, 'password')
  })

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'passwordConfirmation')
    Helper.testStatusForField(systemUnderTest, 'passwordConfirmation')
  })
})
