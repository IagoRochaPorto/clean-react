import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { mockSurveyListModel } from '@/domain/test'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model[]>
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model[]>()
  const systemUnderTest = new RemoteLoadSurveyList(url, httpGetClientSpy)

  return {
    httpGetClientSpy,
    systemUnderTest
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient witch correct URL', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('Should throw UnexpectedError if HttpPGetClient returns 403', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPGetClient returns 404', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPGetClient returns 500', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = systemUnderTest.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a List of RemoteLoadSurveyList.Models if HttpGetClient returns 200', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    const httpResult = mockSurveyListModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await systemUnderTest.loadAll()
    expect(surveyList).toEqual(httpResult)
  })

  test('Should return an empty list if HttpGetClient returns 204', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await systemUnderTest.loadAll()
    expect(surveyList).toEqual([])
  })
})
