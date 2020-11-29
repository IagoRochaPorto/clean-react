import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { mockGetRequest, GetStorageSpy } from '@/data/test'

describe('AuthorizeHttpGetClientDecorator', () => {
  test('Should call getStorage with correct value', () => {
    const getStorageSpy = new GetStorageSpy()
    const systemUnderTest = new AuthorizeHttpGetClientDecorator(getStorageSpy)
    systemUnderTest.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })
})
