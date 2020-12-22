import React, { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move'

import Styles from './survey-result-styles.scss'
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components'
import { LoadSurveyResult } from '@/domain/usecases'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const [state] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })

  useEffect(() => {
    async function load(): Promise<void> {
      loadSurveyResult.load()
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
              <Calendar date={new Date()} className={Styles['calendar-wrapper']} />
              <h2>Lorem Ipsum dolor sit amet?</h2>
            </hgroup>
            <FlipMove className={Styles['answers-list']}>
              <li>
                <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>LoremJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li className={Styles.active}>
                <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>LoremJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li>
                <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
                <span className={Styles.answer}>LoremJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
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
