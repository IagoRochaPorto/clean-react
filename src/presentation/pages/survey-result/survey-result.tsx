import React, { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move'

import Styles from './survey-result-styles.scss'
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components'
import { LoadSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((oldState) => ({ ...oldState, surveyResult: null, error: error.message }))
  })

  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })

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
  }, [])

  return (
    <div className={Styles.surveyResultWrapper}>
      <Header />
      <div data-testid="survey-result" className={Styles.contentWrapper}>
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={state.surveyResult.date} className={Styles['calendar-wrapper']} />
              <h2 data-testid="question">{state.surveyResult.question}</h2>
            </hgroup>
            <FlipMove data-testid="answers" className={Styles['answers-list']}>
              {state.surveyResult.answers.map((answer) => (
                <li
                  className={answer.isCurrentAccountAnswer ? Styles.active : ''}
                  data-testid="answer-wrapper"
                  key={answer.answer}
                >
                  {answer.image && <img data-testid="image" src={answer.image} alt={answer.answer} />}
                  <span data-testid="answer" className={Styles.answer}>
                    {answer.answer}
                  </span>
                  <span data-testid="percent" className={Styles.percent}>
                    {answer.percent}%
                  </span>
                </li>
              ))}
            </FlipMove>
            <button>Voltar</button>{' '}
          </>
        )}
        {state.isLoading && <Loading />}
        {state.error && (
          <Error
            error={state.error}
            reload={() => {
              console.log('')
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
