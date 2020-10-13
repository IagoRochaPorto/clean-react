import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import faker from 'faker'
import { ValidationSpy } from '@/presentation/test'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
  validationSpy: ValidationSpy
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationSpy = new ValidationSpy()
  const systemUnderTest = render(<Login validation={validationSpy} />)
  return {
    systemUnderTest,
    validationSpy
  }
}

describe('Login component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = systemUnderTest.getByTestId('email-status')
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = systemUnderTest.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should call validation with correct email', () => {
    const email = faker.internet.email()
    const { systemUnderTest, validationSpy } = makeSystemUnderTest()
    const emailInput = systemUnderTest.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: email } })
    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call validation with correct password', () => {
    const password = faker.internet.password()
    const { systemUnderTest, validationSpy } = makeSystemUnderTest()
    const passwordInput = systemUnderTest.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })
    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })
})
