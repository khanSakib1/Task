import { configureStore } from '@reduxjs/toolkit'
import tableReducer from './tableSlice'

// Single store for the small app. Kept minimal for clarity.
export const store = configureStore({
  reducer: {
    table: tableReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
