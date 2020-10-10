import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClientSpy } from '../../test/mock-http-client'
import faker from 'faker'

type SystemUnderTest = {
  systemUnderTest: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

const makeSystemUnderTest = (url: string = faker.internet.url()): SystemUnderTest => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const systemUnderTest = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    systemUnderTest,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.auth()
    expect(httpPostClientSpy.url).toBe(url)
  })
})
