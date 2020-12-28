import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockHttpRequest } from '@/data/test/index'
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
  describe('request', () => {
    test('Should call axios with correct values', async () => {
      const request = mockHttpRequest()
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      await systemUnderTest.request(request)
      expect(mockedAxios.request).toHaveBeenCalledWith({
        url: request.url,
        data: request.body,
        headers: request.headers,
        method: request.method
      })
    })

    test('Should return correct response on axios', async () => {
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      const httpResponse = await systemUnderTest.request(mockHttpRequest())
      const axiosResponse = await mockedAxios.request.mock.results[0].value
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('Should return correct error on axios', () => {
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      mockedAxios.request.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = systemUnderTest.request(mockHttpRequest())
      expect(promise).toEqual(mockedAxios.request.mock.results[0].value)
    })
  })
})
