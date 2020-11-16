import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient witch correct URL', async () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy()
    const systemUnderText = new RemoteLoadSurveyList(url, httpGetClientSpy)
    await systemUnderText.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
