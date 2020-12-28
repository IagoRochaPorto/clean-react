import { RemoteSaveSurveyResult } from './remote-save-survey-result'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockSaveSurveyResultParams } from '@/domain/test'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteSaveSurveyResult
  httpClientSpy: HttpClientSpy
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpClientSpy = new HttpClientSpy()
  const systemUnderTest = new RemoteSaveSurveyResult(url, httpClientSpy)
  httpClientSpy.response = {
    statusCode: HttpStatusCode.ok,
    body: mockRemoteSurveyResultModel()
  }
  return {
    systemUnderTest,
    httpClientSpy
  }
}

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest(url)
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    await systemUnderTest.save(saveSurveyResultParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toEqual(saveSurveyResultParams)
  })
})
