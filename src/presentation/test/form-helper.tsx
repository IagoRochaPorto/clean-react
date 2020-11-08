import { RenderResult, fireEvent } from '@testing-library/react'
import faker from 'faker'

export const testChildCount = (systemUnderTest: RenderResult, fieldName: string, count: number): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const testButtonIsDisabled = (systemUnderTest: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = systemUnderTest.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (
  systemUnderTest: RenderResult,
  fieldName: string,
  validationError: string = ''
): void => {
  const wrap = systemUnderTest.getByTestId(`${fieldName}-wrap`)
  const field = systemUnderTest.getByTestId(`${fieldName}`)
  const label = systemUnderTest.getByTestId(`${fieldName}-label`)
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
  expect(field.title).toBe(validationError)
  expect(label.title).toBe(validationError)
}

export const populateField = (systemUnderTest: RenderResult, fieldName: string, value = faker.random.word()): void => {
  const input = systemUnderTest.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testElementExists = (systemUnderTest: RenderResult, fieldName: string): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el).toBeTruthy()
}

export const testElementText = (systemUnderTest: RenderResult, fieldName: string, text: string): void => {
  const el = systemUnderTest.getByTestId(fieldName)
  expect(el.textContent).toBe(text)
}
