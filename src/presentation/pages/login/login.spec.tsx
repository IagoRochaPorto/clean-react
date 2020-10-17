import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SystemUnderTestParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSystemUnderTest = (params?: SystemUnderTestParams): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError || ''
  const systemUnderTest = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )
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
  beforeEach(() => localStorage.clear())
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
  test('Should call Authentication only once', () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    simulateValidSubmit(systemUnderTest)
    simulateValidSubmit(systemUnderTest)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest({ validationError })

    populateEmailField(systemUnderTest)
    fireEvent.submit(systemUnderTest.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(systemUnderTest)
    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    const submit = systemUnderTest.getByTestId('submit')
    await waitFor(() => errorWrapper)
    const mainError = systemUnderTest.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(submit.childElementCount).toBe(1)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    simulateValidSubmit(systemUnderTest)
    await waitFor(() => systemUnderTest.getByTestId('form'))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to signup page', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const register = systemUnderTest.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
