import { SurveyResultModel } from '@/domain/models'

export interface SaveSurveyResult {
  save(answer: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model>
}

export namespace SaveSurveyResult {
  export type Params = {
    answer: string
  }

  export type Model = SurveyResultModel
}
