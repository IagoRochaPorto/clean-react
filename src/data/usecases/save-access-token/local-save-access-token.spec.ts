import { SetStorageSpy } from '@/data/test/mock-storage'
import { LocalSaveAccessToken } from './local-save-access-token'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: LocalSaveAccessToken
  setStorageSpy: SetStorageSpy
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const setStorageSpy = new SetStorageSpy()
  const systemUnderTest = new LocalSaveAccessToken(setStorageSpy)
  return {
    systemUnderTest,
    setStorageSpy
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { systemUnderTest, setStorageSpy } = makeSystemUnderTest()
    const accessToken = faker.random.uuid()
    await systemUnderTest.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
