import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Login from './login'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const systemUnderTest = render(<Login />)
  return {
    systemUnderTest
  }
}

describe('Login component', () => {
  test('Should start with initial state', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const errorWrapper = systemUnderTest.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = systemUnderTest.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = systemUnderTest.getByTestId('email')
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = systemUnderTest.getByTestId('password')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })
})
