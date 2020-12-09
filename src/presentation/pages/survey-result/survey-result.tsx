import React, { useState } from 'react'
import FlipMove from 'react-flip-move'

import Styles from './survey-result-styles.scss'
import { Footer, Header, Spinner } from '@/presentation/components'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrapper}>
      <Header />
      <div className={Styles.contentWrapper}>
        <h2>Lorem Ipsum dolor sit amet?</h2>
        <FlipMove className={Styles['answers-list']}>
          <li>
            <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
            <span className={Styles.answer}>LoremJS</span>
            <span className={Styles.percent}>50%</span>
          </li>
          <li>
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
        <button>Voltar</button>
        <div className={Styles.loadingWrapper}>
          <div className={Styles.loading}>
            <span>Aguarde...</span>
            <Spinner isNegative />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
