import React from 'react'
import Styles from './survey-list-styles.scss'
import { Header, Footer } from '@/presentation/components'
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrapper}>
      <Header />
      <div className={Styles.contentWrapper}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          <SurveyItemEmpty />
        </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
