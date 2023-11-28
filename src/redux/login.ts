import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LoginState {
  userId: number | null;
}

const initialState: LoginState = {
  userId: null,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginUser: (loginState, action: PayloadAction<number>) => {
      loginState.userId = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginUser } = loginSlice.actions

export default loginSlice.reducer