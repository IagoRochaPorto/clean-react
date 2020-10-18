import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/contexts/form/form-context'

const makeSystemUnderTest = (): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name="field" />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const systemUnderTest = makeSystemUnderTest()
    const input = systemUnderTest.getByTestId('field') as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })
})
