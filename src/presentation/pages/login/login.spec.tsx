import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login component', () => {
  test('Should not render error on start', () => {
    const { getByTestId } = render(<Login />)
    const errorWrapper = getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)
  })
})
