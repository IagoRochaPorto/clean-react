import React from 'react'
import { FormStatusBase } from '@/presentation/components'
import { useRecoilValue } from 'recoil'
import { loginState } from '.'

const FormStatus: React.FC = () => {
  const state = useRecoilValue(loginState)
  return <FormStatusBase state={state} />
}

export default FormStatus
