import React, { useEffect, useState } from 'react'
import { Error, Footer, Header, Loading } from '@/presentation/components'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResultContext, SurveyResultData } from '@/presentation/pages/survey-result/components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((oldState) => ({ ...oldState, surveyResult: null, error: error.message }))
  })

  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
    reload: false
  })

  const onAnswer = async (answer: string): Promise<void> => {
    setState((old) => ({ ...old, isLoading: true }))
    try {
      const surveyResult = await saveSurveyResult.save({ answer })
      setState((old) => ({ ...old, surveyResult, isLoading: false }))
    } catch (error) {
      handleError(error)
    }
  }

  const reload = (): void =>
    setState((old) => ({ surveyResult: null, error: '', reload: !old.reload, isLoading: false }))

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const surveyResult = await loadSurveyResult.load()
        setState((old) => ({ ...old, surveyResult }))
      } catch (error) {
        handleError(error)
      }
    }
    load()
  }, [state.reload])

  return (
    <div className={Styles.surveyResultWrapper}>
      <Header />
      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div data-testid="survey-result" className={Styles.contentWrapper}>
          {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={reload} />}
        </div>
      </SurveyResultContext.Provider>
      <Footer />
    </div>
  )
}

export default SurveyResult
