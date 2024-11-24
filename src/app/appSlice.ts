import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from './createAppSlice'

type AppStatus = 'idle' | 'success' | 'error'

const initialState = {
  status: 'idle' as AppStatus,
  statusText: undefined as string | undefined,
}

type State = typeof initialState

const appSlice = createAppSlice({
  name: 'app',
  initialState,
  reducers: {
    appStatusChanged: (state, action: PayloadAction<State>) => {
      return { ...state, ...action.payload }
    },
  },
  selectors: {
    selectAppStatus: (state) => state.status,
    selectAppStatusText: (state) => state.statusText,
  },
})

export const { reducer: appSliceReducer, name } = appSlice
export const { appStatusChanged } = appSlice.actions
export const { selectAppStatus, selectAppStatusText } = appSlice.selectors
