import React, { memo, MouseEvent, useContext } from 'react'
import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import Styles from './header-styles.scss'
import { useHistory } from 'react-router-dom'

const Header: React.FC = () => {
  const history = useHistory()
  const { setCurrentAccount, getCurrentAccount } = useContext(ApiContext)
  const logout = (event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>): void => {
    event.preventDefault()
    setCurrentAccount(undefined)
    history.replace('/login')
  }
  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
