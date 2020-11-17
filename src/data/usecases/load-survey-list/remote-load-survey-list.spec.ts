import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy
}

const makeSystemUnderTest = (url = faker.internet.url()): SystemUnderTestTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
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
})
