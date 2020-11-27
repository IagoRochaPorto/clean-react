import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { RenderResult, render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { ApiContext } from '@/presentation/contexts'
import SignUp from './signup'
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'
import { EmailInUseError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SystemUnderTestParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSystemUnderTest = (params?: SystemUnderTestParams): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError || ''
  const addAccountSpy = new AddAccountSpy()
  const setCurrentAccountMock = jest.fn()
  const systemUnderTest = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <SignUp validation={validationStub} addAccount={addAccountSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    systemUnderTest,
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (
  systemUnderTest: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(systemUnderTest, 'name', name)
  Helper.populateField(systemUnderTest, 'email', email)
  Helper.populateField(systemUnderTest, 'password', password)
  Helper.populateField(systemUnderTest, 'passwordConfirmation', password)

  const form = systemUnderTest.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
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

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest } = makeSystemUnderTest()

    Helper.populateField(systemUnderTest, 'name')
    Helper.populateField(systemUnderTest, 'email')
    Helper.populateField(systemUnderTest, 'password')
    Helper.populateField(systemUnderTest, 'passwordConfirmation')

    Helper.testButtonIsDisabled(systemUnderTest, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)

    Helper.testElementExists(systemUnderTest, 'spinner')
    Helper.testButtonIsDisabled(systemUnderTest, 'submit', true)
  })

  test('Should call AddAccount with correct values', async () => {
    const { systemUnderTest, addAccountSpy } = makeSystemUnderTest()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(systemUnderTest, name, email, password)

    expect(addAccountSpy.params).toEqual({ name, email, password, passwordConfirmation: password })
  })

  test('Should call Authentication only once', async () => {
    const { systemUnderTest, addAccountSpy } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)
    await simulateValidSubmit(systemUnderTest)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { systemUnderTest, addAccountSpy } = makeSystemUnderTest({ validationError })

    await simulateValidSubmit(systemUnderTest)

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { systemUnderTest, addAccountSpy } = makeSystemUnderTest()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit(systemUnderTest)
    Helper.testElementText(systemUnderTest, 'main-error', error.message)
    Helper.testChildCount(systemUnderTest, 'error-wrapper', 1)
  })

  test('Should call updateCurrentAccount on success', async () => {
    const { systemUnderTest, addAccountSpy, setCurrentAccountMock } = makeSystemUnderTest()
    await simulateValidSubmit(systemUnderTest)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to login page', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const loginLink = systemUnderTest.getByTestId('loginLink')
    fireEvent.click(loginLink)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})
