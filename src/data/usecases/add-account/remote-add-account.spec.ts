import { HttpClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockAddAccountModel, mockAddAccountParams } from '@/domain/test'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import { RemoteAddAccount } from './remote-add-account'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteAddAccount
  httpClientSpy: HttpClientSpy<RemoteAddAccount.Model>
}

const makeSystemUnderTest = (url: string = faker.internet.url()): SystemUnderTestTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteAddAccount.Model>()
  const systemUnderTest = new RemoteAddAccount(url, httpClientSpy)
  return {
    systemUnderTest,
    httpClientSpy
  }
}
describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest(url)
    const addAccountParams = mockAddAccountParams()
    await systemUnderTest.add(addAccountParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
    expect(httpClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpClient returns 403', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AddAccount.Model if HttpClient returns 200', async () => {
    const { systemUnderTest, httpClientSpy } = makeSystemUnderTest()
    const httpResult = mockAddAccountModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await systemUnderTest.add(mockAddAccountParams())
    expect(account).toEqual(httpResult)
  })
})
