import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export type Row = {
  id: string
  [key: string]: any
}

export type Column = {
  key: string
  label: string
  visible: boolean
}

type TableState = {
  rows: Row[]
  columns: Column[]
}

const DEFAULT_COLUMNS: Column[] = [
  { key: 'name', label: 'Name', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'age', label: 'Age', visible: true },
  { key: 'role', label: 'Role', visible: true },
]

const loadColumns = (): Column[] => {
  try {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS
    const raw = localStorage.getItem('hdt_columns_v2')
    if (!raw) return DEFAULT_COLUMNS
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not load columns', e)
    return DEFAULT_COLUMNS
  }
}

const initialState: TableState = {
  rows: [
    { id: uuidv4(), name: 'Aisha Khan', email: 'aisha.k@example.com', age: 27, role: 'Frontend' },
    { id: uuidv4(), name: 'Rohit Patel', email: 'rohit.p@example.com', age: 31, role: 'Backend' },
    { id: uuidv4(), name: 'Meera Singh', email: 'meera.s@example.com', age: 24, role: 'Designer' },
  ],
  columns: loadColumns(),
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Row[]>) {
      state.rows = action.payload
    },
    addRow(state, action: PayloadAction<Partial<Row>>) {
      const newRow: Row = { id: uuidv4(), ...action.payload } as Row
      state.rows.unshift(newRow)
    },
    updateRow(state, action: PayloadAction<Row>) {
      const idx = state.rows.findIndex(r => r.id === action.payload.id)
      if (idx > -1) state.rows[idx] = { ...state.rows[idx], ...action.payload }
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter(r => r.id !== action.payload)
    },
    setColumns(state, action: PayloadAction<Column[]>) {
      state.columns = action.payload
      try { localStorage.setItem('hdt_columns_v2', JSON.stringify(state.columns)) } catch (e) {}
    },
    addColumn(state, action: PayloadAction<Column>) {
      state.columns.push(action.payload)
      try { localStorage.setItem('hdt_columns_v2', JSON.stringify(state.columns)) } catch (e) {}
    }
  }
})

export const { setRows, addRow, updateRow, deleteRow, setColumns, addColumn } = tableSlice.actions
export default tableSlice.reducer
