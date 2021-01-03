import React from 'react'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import InputBase from './input'
import faker from 'faker'

const makeSystemUnderTest = (fieldName: string): RenderResult => {
  return render(<InputBase name={fieldName} state={{}} setState={null} />)
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const input = systemUnderTest.getByTestId(field) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('Should remove readOnly on focus', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const input = systemUnderTest.getByTestId(field) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })

  test('Should focus input on label click', () => {
    const field = faker.database.column()
    const systemUnderTest = makeSystemUnderTest(field)
    const input = systemUnderTest.getByTestId(field)
    const label = systemUnderTest.getByTestId(`${field}-label`)
    fireEvent.click(label)
    expect(document.activeElement).toBe(input)
  })
})
