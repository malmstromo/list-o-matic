import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

const ACTION_LOGIN = 'LOGIN';

// naming?
interface LoginState {
  value: string;
}

// Define the initial state using that type
const initialState: LoginState = {
  value: '',
};

interface ActionLogin {
  type: typeof ACTION_LOGIN;
}

export const tokenSlice = createSlice({
  name: 'loginState',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state) => {
      state.value = '';
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    logout: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { login, logout } = tokenSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToken = (state: RootState) => state.tokenReducer.value;

export default tokenSlice.reducer;
