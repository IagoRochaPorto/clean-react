import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { mockHttpRequest, GetStorageSpy, HttpClientSpy } from '@/data/test'
import faker from 'faker'
import { HttpRequest } from '@/data/protocols/http'
import { mockAccountModel } from '@/domain/test'

type SystemUnderTestTypes = {
  systemUnderTest: AuthorizeHttpClientDecorator
  getStorageSpy: GetStorageSpy
  httpClientSpy: HttpClientSpy
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const getStorageSpy = new GetStorageSpy()
  const httpClientSpy = new HttpClientSpy()
  const systemUnderTest = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy)

  return {
    systemUnderTest,
    getStorageSpy,
    httpClientSpy
  }
}

describe('AuthorizeHttpClientDecorator', () => {
  test('Should call getStorage with correct value', async () => {
    const { getStorageSpy, systemUnderTest } = makeSystemUnderTest()
    await systemUnderTest.request(mockHttpRequest())
    expect(getStorageSpy.key).toBe('account')
  })

  test('Should not add token if getStorage is invalid', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words()
      },
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete'])
    }
    await systemUnderTest.request(httpRequest)
    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.headers).toEqual(httpRequest.headers)
    expect(httpClientSpy.method).toEqual(httpRequest.method)
  })

  test('Should add headers to HttpGetClient', async () => {
    const { systemUnderTest, httpClientSpy, getStorageSpy } = makeSystemUnderTest()
    getStorageSpy.value = mockAccountModel()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete'])
    }
    await systemUnderTest.request(httpRequest)
    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.method).toEqual(httpRequest.method)
    expect(httpClientSpy.headers).toEqual({ 'x-access-token': getStorageSpy.value.accessToken })
  })

  test('Should merge headers to HttpGetClient', async () => {
    const { systemUnderTest, httpClientSpy, getStorageSpy } = makeSystemUnderTest()
    getStorageSpy.value = mockAccountModel()
    const field = faker.random.words()
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      headers: {
        field
      },
      method: faker.random.arrayElement(['get', 'post', 'put', 'delete'])
    }
    await systemUnderTest.request(httpRequest)
    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.method).toEqual(httpRequest.method)
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken
    })
  })

  test('Should return the same result as HttpGetClient', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.request(mockHttpRequest())
    expect(httpResponse).toBe(httpClientSpy.response)
  })
})
