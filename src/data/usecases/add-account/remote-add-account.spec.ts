import { RemoteAddAccount } from './remote-add-account'
import { HttpPostClientSpy } from '@/data/test'
import { AddAccountParams } from '@/domain/usecases'
import { mockAddAccountParams } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>
}

const makeSystemUnderTest = (url: string = faker.internet.url()): SystemUnderTestTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>()
  const systemUnderTest = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    systemUnderTest,
    httpPostClientSpy
  }
}
describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { systemUnderTest, httpPostClientSpy } = makeSystemUnderTest(url)
    await systemUnderTest.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })
})
