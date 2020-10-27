import { RenderResult, render } from '@testing-library/react'
import React from 'react'
import SignUp from './signup'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const systemUnderTest = render(<SignUp />)
  return {
    systemUnderTest
  }
}

const testChildCount = (systemUnderTest: RenderResult, fieldName: string, count: number): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

const testButtonIsDisabled = (systemUnderTest: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = systemUnderTest.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testStatusForField = (systemUnderTest: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = systemUnderTest.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Deu certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🔵')
}

describe('Signup component', () => {
  test('Should start with initial state', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const validationError = 'Campo obrigatório'
    testChildCount(systemUnderTest, 'error-wrapper', 0)
    testButtonIsDisabled(systemUnderTest, 'submit', true)
    testStatusForField(systemUnderTest, 'name', validationError)
    testStatusForField(systemUnderTest, 'email', validationError)
    testStatusForField(systemUnderTest, 'password', validationError)
    testStatusForField(systemUnderTest, 'passwordConfirmation', validationError)
  })
})
