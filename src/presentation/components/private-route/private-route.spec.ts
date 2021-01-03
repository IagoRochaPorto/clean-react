import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from './private-route'
import { mockAccountModel } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'

type SystemUnderTestTypes = {
  history: MemoryHistory
}

const makeSystemUnderTest = (account = mockAccountModel()): SystemUnderTestTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  renderWithHistory({
    history,
    Page: PrivateRoute,
    account
  })
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSystemUnderTest(null)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { history } = makeSystemUnderTest()
    expect(history.location.pathname).toBe('/')
  })
})
