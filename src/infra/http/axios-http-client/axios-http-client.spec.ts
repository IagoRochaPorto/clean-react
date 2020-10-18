import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockPostRequest } from '@/data/test/index'
import axios from 'axios'

jest.mock('axios')
type SystemUnderTestTypes = {
  systemUnderTest: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}
const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const systemUnderTest = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return {
    systemUnderTest,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('Should call axios with correct values', async () => {
    const request = mockPostRequest()
    const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
    await systemUnderTest.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return the correct status code and the body', () => {
    const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
    const promise = systemUnderTest.post(mockPostRequest())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })

  test('Should return the correct status code and the body on failure', () => {
    const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
    mockedAxios.post.mockRejectedValueOnce({
      response: mockHttpResponse()
    })
    const promise = systemUnderTest.post(mockPostRequest())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
