import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'

const makeSystemUnderSystem = (): void => {
  render(<SurveyList />)
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', () => {
    makeSystemUnderSystem()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty').length).toBe(4)
  })
})
