import {
  appStatusChanged,
  selectAppStatus,
  selectAppStatusText,
} from '@/app/appSlice'
import { useAppSelector } from '../hooks/useAppSelector'
import { useEffect } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch'

export const MessagePopup = () => {
  const appStatus = useAppSelector(selectAppStatus)
  const appStatusText = useAppSelector(selectAppStatusText)
  const dispatch = useAppDispatch()

  let content
  if (appStatus === 'success') {
    content = <div style={{ color: 'green' }}>{appStatusText}</div>
  }
  if (appStatus === 'error') {
    content = <div style={{ color: 'red' }}>{appStatusText}</div>
  }

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        appStatusChanged({
          status: 'idle',
          statusText: null,
        }),
      )
    }, 3000)
  })

  return content
}
