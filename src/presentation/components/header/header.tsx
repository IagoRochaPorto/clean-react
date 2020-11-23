import React, { memo } from 'react'
import { Logo } from '@/presentation/components'
import Styles from './header-styles.scss'

const Header: React.FC = () => {
  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span>Iago</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
