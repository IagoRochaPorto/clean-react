import React, { useState } from 'react'
import FlipMove from 'react-flip-move'

import Styles from './survey-result-styles.scss'
import { Calendar, Footer, Header, Loading } from '@/presentation/components'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrapper}>
      <Header />
      <div className={Styles.contentWrapper}>
        {true && (
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
        {false && <Loading />}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
