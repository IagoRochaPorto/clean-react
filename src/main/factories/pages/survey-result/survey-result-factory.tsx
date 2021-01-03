import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { makeRemoteLoadSurveyResult, makeRemoteSaveSurveyResult } from '@/main/factories/usecases'
import { useParams } from 'react-router-dom'

export const makeSurveyResult: React.FC = () => {
  type Props = {
    id: string
  }
  const { id } = useParams<Props>()
  return (
    <SurveyResult saveSurveyResult={makeRemoteSaveSurveyResult(id)} loadSurveyResult={makeRemoteLoadSurveyResult(id)} />
  )
}
