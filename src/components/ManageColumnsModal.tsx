"use client";

import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, TextField, Box } from '@mui/material'
import { Column, setColumns, addColumn } from '../store/tableSlice'
import { useAppDispatch, useAppSelector } from '../hooks'

type Props = { open: boolean; onClose: () => void }

export default function ManageColumnsModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const columns = useAppSelector(s => s.table.columns)
  const [localCols, setLocalCols] = useState<Column[]>(columns)
  const [newField, setNewField] = useState('')

  useEffect(() => {
    if (open) setLocalCols(columns)
  }, [open, columns])

  const toggle = (key: string) => setLocalCols(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c))

  const onSave = () => {
    dispatch(setColumns(localCols))
    onClose()
  }

  const onAdd = () => {
    const label = newField.trim()
    if (!label) return
    const key = label.toLowerCase().replace(/\s+/g, '_')
    const col: Column = { key, label, visible: true }
    dispatch(addColumn(col))
    setNewField('')
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {localCols.map(c => (
            <FormControlLabel key={c.key} control={<Checkbox checked={c.visible} onChange={() => toggle(c.key)} />} label={c.label} />
          ))}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField size="small" placeholder="Add new field (e.g. Department)" value={newField} onChange={e => setNewField(e.target.value)} />
            <Button variant="contained" onClick={onAdd}>Add</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
