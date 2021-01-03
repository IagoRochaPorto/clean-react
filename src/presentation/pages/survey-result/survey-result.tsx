import React, { useEffect } from 'react'
import { Error, Footer, Header, Loading } from '@/presentation/components'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResultData, surveyResultState, onSurveyAnswerState } from '@/presentation/pages/survey-result/components'
import Styles from './survey-result-styles.scss'
import { useRecoilState, useSetRecoilState } from 'recoil'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((oldState) => ({ ...oldState, surveyResult: null, error: error.message, isLoading: false }))
  })

  const [state, setState] = useRecoilState(surveyResultState)
  const setOnAnswer = useSetRecoilState(onSurveyAnswerState)

  const onAnswer = async (answer: string): Promise<void> => {
    if (state.isLoading) return

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
    setOnAnswer({ onAnswer })
  }, [])

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
      <div data-testid="survey-result" className={Styles.contentWrapper}>
        {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={reload} />}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
