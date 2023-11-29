import { configureStore } from '@reduxjs/toolkit'
import { loginSlice } from './login'
import { loadingSlice } from './loading'

export const store = configureStore({
  reducer: {
    loginUser: loginSlice.reducer,
    loadingState: loadingSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch