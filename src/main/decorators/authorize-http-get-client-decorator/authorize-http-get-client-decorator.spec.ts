import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { mockGetRequest, GetStorageSpy } from '@/data/test'

type SystemUnderTestTypes = {
  systemUnderTest: AuthorizeHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const getStorageSpy = new GetStorageSpy()
  const systemUnderTest = new AuthorizeHttpGetClientDecorator(getStorageSpy)

  return {
    systemUnderTest,
    getStorageSpy
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('Should call getStorage with correct value', () => {
    const { getStorageSpy, systemUnderTest } = makeSystemUnderTest()
    systemUnderTest.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })
})
