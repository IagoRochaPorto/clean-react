import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  const { mainError } = state
  return (
    <div data-testid="error-wrapper" className={Styles.errorWrapper}>
      {mainError && <span className={Styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus
