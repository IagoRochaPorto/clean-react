import React, { memo } from 'react'
import Styles from './footer-styles.scss'

type Props = React.HTMLAttributes<HTMLElement>

const Footer: React.FC<Props> = () => {
  return <footer className={Styles.footer} />
}

export default memo(Footer)
