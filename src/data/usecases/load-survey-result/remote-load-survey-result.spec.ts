import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { HttpGetClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError } from '@/domain/errors'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const systemUnderTest = new RemoteLoadSurveyResult(url, httpGetClientSpy)
  return {
    systemUnderTest,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct url', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.load()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('Should throw AccessDeniedError if HttpGetClient returns 403', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = systemUnderTest.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })
})
