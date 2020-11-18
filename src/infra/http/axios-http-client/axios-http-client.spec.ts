import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockGetRequest, mockPostRequest } from '@/data/test/index'
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
  describe('post', () => {
    test('Should call axios.post with correct values', async () => {
      const request = mockPostRequest()
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      await systemUnderTest.post(request)
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('Should return correct response on axios.post', () => {
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      const promise = systemUnderTest.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })

    test('Should return correct error on axios.post', () => {
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = systemUnderTest.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })

  describe('get', () => {
    test('Should call axios.get with correct values', async () => {
      const request = mockGetRequest()
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      await systemUnderTest.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })

    test('Should return correct response on axios.get', async () => {
      const { systemUnderTest, mockedAxios } = makeSystemUnderTest()
      const httpResponse = await systemUnderTest.get(mockGetRequest())
      const axiosResponse = await mockedAxios.get.mock.results[0].value
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })
  })
})
