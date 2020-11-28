import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyList } from '@/presentation/pages'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++
    return []
  }
}

type SystemUnderTestTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSystemUnderSystem = (): SystemUnderTestTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)

  return {
    loadSurveyListSpy
  }
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', () => {
    makeSystemUnderSystem()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty').length).toBe(4)
  })

  test('Should call LoadSurveyList', () => {
    const { loadSurveyListSpy } = makeSystemUnderSystem()
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
