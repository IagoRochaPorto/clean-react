import React from 'react'
import Styles from './result-styles.scss'
import FlipMove from 'react-flip-move'
import { Calendar } from '@/presentation/components'
import { useHistory } from 'react-router-dom'
import { LoadSurveyResult } from '@/domain/usecases'

type Props = {
  surveyResult: LoadSurveyResult.Model
}

const Result: React.FC<Props> = ({ surveyResult }: Props) => {
  const { goBack } = useHistory()
  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles['calendar-wrapper']} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>
      <FlipMove data-testid="answers" className={Styles['answers-list']}>
        {surveyResult.answers.map((answer) => (
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
      <button className={Styles.button} data-testid="back-button" onClick={() => goBack()}>
        Voltar
      </button>
    </>
  )
}

export default Result
