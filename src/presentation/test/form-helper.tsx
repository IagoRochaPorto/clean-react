import { RenderResult } from '@testing-library/react'

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
  validationError?: string
): void => {
  const fieldStatus = systemUnderTest.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Deu certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🔵')
}
