import React from 'react'
import { FormStatusBase } from '@/presentation/components'
import { useRecoilValue } from 'recoil'
import { signupState } from '.'

const FormStatus: React.FC = () => {
  const state = useRecoilValue(signupState)
  return <FormStatusBase state={state} />
}

export default FormStatus
