import React, { memo } from 'react'
import Styles from './login-header-styles.scss'
import { Logo } from '@/presentation/components'

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.headerWrapper}>
      <Logo />
      <h1>IagoDev - Enquetes para Programadores</h1>
    </header>
  )
}

export default memo(LoginHeader)
