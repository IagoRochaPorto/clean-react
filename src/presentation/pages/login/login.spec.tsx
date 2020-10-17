import React from 'react'
import faker, { system } from 'faker'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SystemUnderTestParams = {
  validationError: string
}

const makeSystemUnderTest = (params?: SystemUnderTestParams): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError || ''
  const systemUnderTest = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return {
    systemUnderTest,
    authenticationSpy
  }
}

const simulateValidSubmit = (
  systemUnderTest: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  populateEmailField(systemUnderTest, email)
  populatePasswordField(systemUnderTest, password)

  const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
  fireEvent.click(submitButton)
}

const populateEmailField = (systemUnderTest: RenderResult, email = faker.internet.email()): void => {
  const emailInput = systemUnderTest.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (systemUnderTest: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = systemUnderTest.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (systemUnderTest: RenderResult, fieldName: string, validationError?: string): void => {
  const emailStatus = systemUnderTest.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'Deu certo!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🔵')
}

describe('Login component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateStatusForField(systemUnderTest, 'email', validationError)
    simulateStatusForField(systemUnderTest, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    populateEmailField(systemUnderTest)
    simulateStatusForField(systemUnderTest, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    populatePasswordField(systemUnderTest)
    simulateStatusForField(systemUnderTest, 'password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populateEmailField(systemUnderTest)
    simulateStatusForField(systemUnderTest, 'email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populatePasswordField(systemUnderTest)
    simulateStatusForField(systemUnderTest, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populateEmailField(systemUnderTest)
    populatePasswordField(systemUnderTest)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    simulateValidSubmit(systemUnderTest)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    const spinner = systemUnderTest.getByTestId('spinner')
    expect(spinner).toBeTruthy()
    expect(submitButton.disabled).toBe(true)
  })

  test('Should call Authentication with correct values', () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(systemUnderTest, email, password)

    expect(authenticationSpy.params).toEqual({ email, password })
  })
})
