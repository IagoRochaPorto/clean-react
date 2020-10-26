import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockAccountModel, mockAuthentication } from '@/domain/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSystemUnderTest = (url: string = faker.internet.url()): SystemUnderTestTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
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
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = systemUnderTest.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = systemUnderTest.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = systemUnderTest.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = systemUnderTest.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await systemUnderTest.auth(mockAuthentication())
    expect(account).toEqual(httpResult)
  })
})
