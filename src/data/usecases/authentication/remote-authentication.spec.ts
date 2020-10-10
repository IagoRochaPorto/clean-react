import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClientSpy } from '@/data/test/mock-http-client'
import { mockAuthentication } from '@/domain/test/mock-authentication'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
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
    await systemUnderTest.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    const authenticationParams = mockAuthentication()
    await systemUnderTest.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unathourized
    }
    const promise = systemUnderTest.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })
})
