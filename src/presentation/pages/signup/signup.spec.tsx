import { RenderResult, render } from '@testing-library/react'
import React from 'react'
import SignUp from './signup'
import { Helper } from '@/presentation/test'

type SystemUnderTestTypes = {
  systemUnderTest: RenderResult
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const systemUnderTest = render(<SignUp />)
  return {
    systemUnderTest
  }
}

describe('Signup component', () => {
  test('Should start with initial state', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const validationError = 'Campo obrigatório'
    Helper.testChildCount(systemUnderTest, 'error-wrapper', 0)
    Helper.testButtonIsDisabled(systemUnderTest, 'submit', true)
    Helper.testStatusForField(systemUnderTest, 'name', validationError)
    Helper.testStatusForField(systemUnderTest, 'email', validationError)
    Helper.testStatusForField(systemUnderTest, 'password', validationError)
    Helper.testStatusForField(systemUnderTest, 'passwordConfirmation', validationError)
  })
})
