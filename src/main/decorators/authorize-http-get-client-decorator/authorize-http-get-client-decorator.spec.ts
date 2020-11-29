import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { mockGetRequest, GetStorageSpy, HttpGetClientSpy } from '@/data/test'
import faker from 'faker'
import { HttpGetParams } from '@/data/protocols/http'

type SystemUnderTestTypes = {
  systemUnderTest: AuthorizeHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
  httpGetClientSpy: HttpGetClientSpy
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const getStorageSpy = new GetStorageSpy()
  const httpGetClientSpy = new HttpGetClientSpy()
  const systemUnderTest = new AuthorizeHttpGetClientDecorator(getStorageSpy, httpGetClientSpy)

  return {
    systemUnderTest,
    getStorageSpy,
    httpGetClientSpy
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('Should call getStorage with correct value', async () => {
    const { getStorageSpy, systemUnderTest } = makeSystemUnderTest()
    await systemUnderTest.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })

  test('Should not add token if getStorage is invalid', async () => {
    const { systemUnderTest, httpGetClientSpy } = makeSystemUnderTest()
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words()
      }
    }
    await systemUnderTest.get(httpRequest)
    expect(httpGetClientSpy.url).toBe(httpRequest.url)
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers)
  })
})
