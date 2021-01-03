import { Header, currentAccountState } from '@/presentation/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'

type SystemUnderTestTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSystemUnderTest = (account = mockAccountModel()): SystemUnderTestTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const setCurrentAccountMock = jest.fn()
  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(currentAccountState, { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => account })
      }
    >
      <Router history={history}>
        <Header />)
      </Router>
    </RecoilRoot>
  )
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
