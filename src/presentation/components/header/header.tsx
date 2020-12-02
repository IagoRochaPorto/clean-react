import React, { memo, useContext } from 'react'
import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import Styles from './header-styles.scss'
import { useLogout } from '@/presentation/hooks'

const Header: React.FC = () => {
  const logout = useLogout()
  const { getCurrentAccount } = useContext(ApiContext)
  const buttonClick = (event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>): void => {
    event.preventDefault()
    logout()
  }
  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={buttonClick}>
            Sair
          </a>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
