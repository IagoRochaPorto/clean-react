import faker from 'faker'
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from './local-storage-adapter'

const makeSystemUnderTest = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => localStorage.clear())
  test('Should call localStorage with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const key = faker.database.column()
    const value = faker.random.word()
    await systemUnderTest.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})
