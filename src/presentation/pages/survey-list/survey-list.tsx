import React from 'react'
import Styles from './survey-list-styles.scss'
import { Header, Footer } from '@/presentation/components'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrapper}>
      <Header />
      <div className={Styles.contentWrapper}>
        <h2>Enquetes</h2>
        <ul></ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
