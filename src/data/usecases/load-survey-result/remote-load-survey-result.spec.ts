import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct url', async () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy()
    const systemUnderTest = new RemoteLoadSurveyResult(url, httpGetClientSpy)
    await systemUnderTest.load()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
