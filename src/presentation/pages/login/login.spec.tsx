import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { ApiContext } from '@/presentation/contexts'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, Helper } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SystemUnderTestParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSystemUnderTest = (params?: SystemUnderTestParams): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError || ''
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  const systemUnderTest = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    systemUnderTest,
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (
  systemUnderTest: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(systemUnderTest, 'email', email)
  Helper.populateField(systemUnderTest, 'password', password)

  const form = systemUnderTest.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { systemUnderTest } = makeSystemUnderTest({ validationError })

    Helper.testChildCount(systemUnderTest, 'error-wrapper', 0)
    Helper.testButtonIsDisabled(systemUnderTest, 'submit', true)
    Helper.testStatusForField(systemUnderTest, 'email', validationError)
    Helper.testStatusForField(systemUnderTest, 'password', validationError)
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

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'email')
    Helper.populateField(systemUnderTest, 'password')

    Helper.testButtonIsDisabled(systemUnderTest, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)

    Helper.testElementExists(systemUnderTest, 'spinner')
    Helper.testButtonIsDisabled(systemUnderTest, 'submit', true)
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
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    await simulateValidSubmit(systemUnderTest)
    Helper.testElementText(systemUnderTest, 'main-error', error.message)
    Helper.testChildCount(systemUnderTest, 'error-wrapper', 1)
  })

  test('Should call updateCurrentAccount on success', async () => {
    const { systemUnderTest, authenticationSpy, setCurrentAccountMock } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to signup page', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const register = systemUnderTest.getByTestId('signupLink')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
