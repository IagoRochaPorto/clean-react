import { Header } from '@/presentation/components'
import { fireEvent, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'

type SystemUnderTestTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSystemUnderTest = (account = mockAccountModel()): SystemUnderTestTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: Header,
    account
  })

  return {
    history,
    setCurrentAccountMock
  }
}

describe('Header Component', () => {
  test('Should call setCurrentAccount with undefined value ', () => {
    const { history, setCurrentAccountMock } = makeSystemUnderTest()
    fireEvent.click(screen.getByTestId('logout'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname)
  })

  test('Should render username correctly ', () => {
    const account = mockAccountModel()
    makeSystemUnderTest(account)
    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
