import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define a type for the slice state
interface TokenState {
  value: string;
}

// Define the initial state using that type
const initialState: TokenState = {
  value: '',
};

export const tokenSlice = createSlice({
  name: 'token',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    remove: (state) => {
      state.value = '';
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    add: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { remove, add } = tokenSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToken = (state: RootState) => state.tokenReducer.value;

export default tokenSlice.reducer;
