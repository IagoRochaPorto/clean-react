import { RemoteSaveSurveyResult } from './remote-save-survey-result'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
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
  test('Should call HttpClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.save({
      answer: faker.random.word()
    })
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
  })
})
