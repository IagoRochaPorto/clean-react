import React, { useContext, useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { Header, Footer, Error } from '@/presentation/components'
import { SurveyListItem } from '@/presentation/pages/survey-list/components'
import { LoadSurveyList } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((oldState) => ({ ...oldState, error: error.message }))
  })
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false
  })

  const reload = (): void => setState((old) => ({ surveys: [], error: '', reload: !old.reload }))

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState((oldState) => ({ ...oldState, surveys })))
      .catch(handleError)
  }, [state.reload])
  return (
    <div className={Styles.surveyListWrapper}>
      <Header />
      <div className={Styles.contentWrapper}>
        <h2>Enquetes</h2>
        {state.error ? <Error error={state.error} reload={reload} /> : <SurveyListItem surveys={state.surveys} />}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
