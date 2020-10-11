import { AxiosHttpClient } from './axios-http-client'
import axios from 'axios'
import faker from 'faker'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSystemUnderTest = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL and verb', async () => {
    const url = faker.internet.url()
    const systemUnderTest = makeSystemUnderTest()
    await systemUnderTest.post({ url })
    expect(mockedAxios.post).toHaveBeenCalledWith(url)
  })
})
