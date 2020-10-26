import { SetStorageMock } from '@/data/test'
import { LocalSaveAccessToken } from './local-save-access-token'
import faker from 'faker'

type SystemUnderTestTypes = {
  systemUnderTest: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const setStorageMock = new SetStorageMock()
  const systemUnderTest = new LocalSaveAccessToken(setStorageMock)
  return {
    systemUnderTest,
    setStorageMock
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { systemUnderTest, setStorageMock } = makeSystemUnderTest()
    const accessToken = faker.random.uuid()
    await systemUnderTest.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  test('Should throw if SetStorage throws', async () => {
    const { systemUnderTest, setStorageMock } = makeSystemUnderTest()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.save(faker.random.uuid())
    await expect(promise).rejects.toThrow(new Error())
  })
})
