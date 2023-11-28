import { configureStore } from '@reduxjs/toolkit'
import { loginSlice } from './login'

export const store = configureStore({
  reducer: {
    loginUser: loginSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch