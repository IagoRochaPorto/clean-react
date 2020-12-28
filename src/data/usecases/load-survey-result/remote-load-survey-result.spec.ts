import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyResult
  httpClientSpy: HttpClientSpy
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpClientSpy = new HttpClientSpy()
  const systemUnderTest = new RemoteLoadSurveyResult(url, httpClientSpy)
  httpClientSpy.response = {
    statusCode: HttpStatusCode.ok,
    body: mockRemoteSurveyResultModel()
  }
  return {
    systemUnderTest,
    httpClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.load()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = systemUnderTest.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = systemUnderTest.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = systemUnderTest.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a SurveyResult on 200', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    const httpResult = mockRemoteSurveyResultModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await systemUnderTest.load()
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date)
    })
  })
})
