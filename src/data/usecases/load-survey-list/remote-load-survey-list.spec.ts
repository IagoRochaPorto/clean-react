import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { SurveyModel } from '@/domain/models'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>()
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
})
