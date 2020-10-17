import React from 'react'
import faker from 'faker'
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

describe('Login component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe('Deu certo!')
    expect(emailStatus.textContent).toBe('🔵')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Deu certo!')
    expect(passwordStatus.textContent).toBe('🔵')
  })

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
    const spinner = systemUnderTest.getByTestId('spinner')
    expect(spinner).toBeTruthy()
    expect(submitButton.disabled).toBe(true)
  })

  test('Should call Authentication with correct values', () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: email } })

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
    expect(authenticationSpy.params).toEqual({ email, password })
  })
})
