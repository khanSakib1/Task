"use client";

import React from 'react'
import { Button } from '@mui/material'
import { parseCsv, exportToCsv } from '../utils/csv'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setRows } from '../store/tableSlice'

export default function ImportExport() {
  const rows = useAppSelector(s => s.table.rows)
  const columns = useAppSelector(s => s.table.columns)
  const dispatch = useAppDispatch()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await parseCsv(file)
      if (res.errors && res.errors.length) {
        alert('CSV parse issues: ' + (res.errors[0]?.message || JSON.stringify(res.errors)))
      }
      const mapped = res.data.map((r, i) => ({ id: String(Date.now() + i), ...r }))
      dispatch(setRows(mapped))
    } catch (err) {
      console.error('Import failed', err)
      alert('Failed to import CSV, see console.')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="contained" component="label">Import CSV
        <input hidden accept=".csv" type="file" onChange={handleFile} />
      </Button>
      <Button variant="outlined" onClick={() => exportToCsv(rows, columns)}>Export CSV</Button>
    </div>
  )
}
