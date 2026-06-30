import { createSlice } from '@reduxjs/toolkit';
import type { UsersState } from '../types/users.types';
import { fetchUsersThunk, createUserThunk, updateUserThunk } from './users.thunk';

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  success: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = 'Usuario creado correctamente.';
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
        state.success = 'Usuario actualizado correctamente.';
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = usersSlice.actions;
export default usersSlice.reducer;
