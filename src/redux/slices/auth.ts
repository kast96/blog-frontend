import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from '../../axios'

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
  const {data} = await axios.post(`/auth/login`, params)
  return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const {data} = await axios.post(`/auth/register`, params)
  return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (params) => {
  const {data} = await axios.get(`/auth/me`)
  return data
})

const initialState = {
  data: null,
  status: 'loading'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
    }
  },
  extraReducers: {
    //@ts-ignore
    [fetchLogin.pending]: (state) => {
      state.data = null
      state.status = 'loading'
    },
    //@ts-ignore
    [fetchLogin.fulfilled]: (state, action) => {
      state.data = action.payload
      state.status = 'loaded'
    },
    //@ts-ignore
    [fetchLogin.rejected]: (state) => {
      state.data = null
      state.status = 'error'
    },
    //@ts-ignore
    [fetchAuthMe.pending]: (state) => {
      state.data = null
      state.status = 'loading'
    },
    //@ts-ignore
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload
      state.status = 'loaded'
    },
    //@ts-ignore
    [fetchAuthMe.rejected]: (state) => {
      state.data = null
      state.status = 'error'
    },
    //@ts-ignore
    [fetchRegister.pending]: (state) => {
      state.data = null
      state.status = 'loading'
    },
    //@ts-ignore
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload
      state.status = 'loaded'
    },
    //@ts-ignore
    [fetchRegister.rejected]: (state) => {
      state.data = null
      state.status = 'error'
    },
  }
})

export const selectIsAuth = (state: any) => Boolean(state.auth.data)
export const authReducer = authSlice.reducer
export const {logout} = authSlice.actions