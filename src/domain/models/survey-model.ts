export type SurveyModel = {
  id: string
  question: string
  answers: AnswerModel[]
  date: Date
  didAnswer: boolean
}

type AnswerModel = {
  image?: string
  answer: string
}
