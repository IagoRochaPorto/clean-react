import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyList
  httpClientSpy: HttpClientSpy<RemoteLoadSurveyList.Model[]>
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadSurveyList.Model[]>()
  const systemUnderTest = new RemoteLoadSurveyList(url, httpClientSpy)

  return {
    httpClientSpy,
    systemUnderTest
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient witch correct URL and method', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.loadAll()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  test('Should throw AccessDenied if HttpClient returns 403', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a List of RemoteLoadSurveyList.Models if HttpGetClient returns 200', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    const httpResult = mockRemoteSurveyListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await systemUnderTest.loadAll()
    expect(surveyList).toEqual([
      {
        id: httpResult[0].id,
        question: httpResult[0].question,
        didAnswer: httpResult[0].didAnswer,
        date: new Date(httpResult[0].date)
      },
      {
        id: httpResult[1].id,
        question: httpResult[1].question,
        didAnswer: httpResult[1].didAnswer,
        date: new Date(httpResult[1].date)
      },
      {
        id: httpResult[2].id,
        question: httpResult[2].question,
        didAnswer: httpResult[2].didAnswer,
        date: new Date(httpResult[2].date)
      }
    ])
  })

  test('Should return an empty list if HttpGetClient returns 204', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await systemUnderTest.loadAll()
    expect(surveyList).toEqual([])
  })
})
