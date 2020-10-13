import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import faker, { system } from 'faker'
import { ValidationStub } from '@/presentation/test'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  validationStub: ValidationStub
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
  const systemUnderTest = render(<Login validation={validationStub} />)
  return {
    systemUnderTest,
    validationStub
  }
}

describe('Login component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if Validation fails', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    validationStub.errorMessage = ''
    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe('Deu certo!')
    expect(emailStatus.textContent).toBe('🔵')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    validationStub.errorMessage = ''
    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Deu certo!')
    expect(passwordStatus.textContent).toBe('🔵')
  })

  test('Should enable submit button if form is valid', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    validationStub.errorMessage = ''

    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })
})
