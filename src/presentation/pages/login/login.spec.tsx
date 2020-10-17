import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker, { system } from 'faker'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor, wait } from '@testing-library/react'
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

const simulateValidSubmit = async (
  systemUnderTest: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  populateEmailField(systemUnderTest, email)
  populatePasswordField(systemUnderTest, password)

  const form = systemUnderTest.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
}

const populateEmailField = (systemUnderTest: RenderResult, email = faker.internet.email()): void => {
  const emailInput = systemUnderTest.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (systemUnderTest: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = systemUnderTest.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = (systemUnderTest: RenderResult, fieldName: string, validationError?: string): void => {
  const emailStatus = systemUnderTest.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'Deu certo!')
  testElementText(systemUnderTest, `${fieldName}-status`, validationError ? '🔴' : '🔵')
}

const testErrorWraperChildCount = (systemUnderTest: RenderResult, count: number): void => {
  const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
  expect(errorWrapper.childElementCount).toBe(count)
}

const testElementExists = (systemUnderTest: RenderResult, fieldName: string): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el).toBeTruthy()
}

const testElementText = (systemUnderTest: RenderResult, fieldName: string, text: string): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el.textContent).toBe(text)
}

const testButtonIsDisabled = (systemUnderTest: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = systemUnderTest.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login component', () => {
  afterEach(cleanup)
  beforeEach(() => localStorage.clear())
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    testErrorWraperChildCount(systemUnderTest, 0)
    testButtonIsDisabled(systemUnderTest, 'submit', true)
    testStatusForField(systemUnderTest, 'email', validationError)
    testStatusForField(systemUnderTest, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    populateEmailField(systemUnderTest)
    testStatusForField(systemUnderTest, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    populatePasswordField(systemUnderTest)
    testStatusForField(systemUnderTest, 'password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populateEmailField(systemUnderTest)
    testStatusForField(systemUnderTest, 'email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populatePasswordField(systemUnderTest)
    testStatusForField(systemUnderTest, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    populateEmailField(systemUnderTest)
    populatePasswordField(systemUnderTest)

    testButtonIsDisabled(systemUnderTest, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)

    testElementExists(systemUnderTest, 'spinner')
    testButtonIsDisabled(systemUnderTest, 'submit', true)
  })

  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(systemUnderTest, email, password)

    expect(authenticationSpy.params).toEqual({ email, password })
  })
  test('Should call Authentication only once', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)
    await simulateValidSubmit(systemUnderTest)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest({ validationError })

    await simulateValidSubmit(systemUnderTest)

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(systemUnderTest)
    testElementText(systemUnderTest, 'main-error', error.message)
    testErrorWraperChildCount(systemUnderTest, 1)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { systemUnderTest, authenticationSpy } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)
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
