import { SetStorageMock } from '@/data/test'
import { LocalUpdateCurrentAccount } from './local-update-current-account'
import faker from 'faker'
import { UnexpectedError } from '@/domain/errors'
import { mockAccountModel } from '@/domain/test'

type SystemUnderTestTypes = {
  systemUnderTest: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const setStorageMock = new SetStorageMock()
  const systemUnderTest = new LocalUpdateCurrentAccount(setStorageMock)
  return {
    systemUnderTest,
    setStorageMock
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('Should call SetStorage with correct value', async () => {
    const { systemUnderTest, setStorageMock } = makeSystemUnderTest()
    const account = mockAccountModel()
    await systemUnderTest.save(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  test('Should throw if SetStorage throws', async () => {
    const { systemUnderTest, setStorageMock } = makeSystemUnderTest()
    jest.spyOn(setStorageMock, 'set').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = systemUnderTest.save(mockAccountModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should throw if AccessToken is falsy', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const promise = systemUnderTest.save(undefined)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
