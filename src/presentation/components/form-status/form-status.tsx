import React from 'react'
import Styles from './form-status-styles.scss'

type Props = {
  state: any
}

const FormStatus: React.FC<Props> = ({ state }: Props) => {
  const { mainError } = state
  return (
    <div data-testid="error-wrapper" className={Styles.errorWrapper}>
      {mainError && (
        <span data-testid="main-error" className={Styles.error}>
          {mainError}
        </span>
      )}
    </div>
  )
}

export default FormStatus
