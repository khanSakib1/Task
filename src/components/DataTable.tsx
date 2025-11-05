"use client";

import React, { useMemo, useState } from 'react'
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TextField, IconButton, Box, Button
} from '@mui/material'
import { ArrowUpward, ArrowDownward, Edit, Delete, Settings, Save, Close } from '@mui/icons-material'
import ManageColumnsModal from './ManageColumnsModal'
import ImportExport from './ImportExport'
import { useAppSelector, useAppDispatch } from '../hooks'
import { deleteRow, updateRow } from '../store/tableSlice'

export default function DataTable() {
  const columns = useAppSelector(s => s.table.columns)
  const rows = useAppSelector(s => s.table.rows)
  const dispatch = useAppDispatch()

  const [page, setPage] = useState(0)
  const rowsPerPage = 10
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [isColModalOpen, setColModalOpen] = useState(false)

  // inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBuffer, setEditBuffer] = useState<Record<string, any>>({})

  const shownColumns = columns.filter(c => c.visible)

  const processed = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = rows.filter(r => {
      if (!q) return true
      return shownColumns.some(col => String(r[col.key] ?? '').toLowerCase().includes(q))
    })

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const A = a[sortKey] ?? ''
        const B = b[sortKey] ?? ''
        if (A < B) return sortDir === 'asc' ? -1 : 1
        if (A > B) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return list
  }, [rows, query, shownColumns, sortKey, sortDir])

  const pageRows = processed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const startEdit = (row: any) => {
    setEditingId(row.id)
    setEditBuffer({ ...row })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditBuffer({})
  }

  const saveEdit = () => {
    // simple validation: age must be a number if present
    if (editBuffer.age && isNaN(Number(editBuffer.age))) {
      alert('Age must be a number')
      return
    }
    dispatch(updateRow(editBuffer as any))
    setEditingId(null)
    setEditBuffer({})
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search across visible columns..." value={query} onChange={e => setQuery(e.target.value)} />
          <ImportExport />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => {
            // add a blank row to edit immediately
            const id = String(Date.now())
            dispatch(updateRow({ id, name: 'New User', email: '', age: '', role: '' }))
            // Instead of using updateRow for new, we'd use addRow in real flow; kept concise here.
            startEdit({ id, name: 'New User', email: '', age: '', role: '' })
          }}>Add Row</Button>
          <IconButton title="Manage columns" onClick={() => setColModalOpen(true)}><Settings /></IconButton>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {shownColumns.map(col => (
                <TableCell key={col.key} sx={{ cursor: 'pointer' }} onClick={() => handleSort(col.key)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {col.label}
                    {sortKey === col.key ? (sortDir === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
                  </Box>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map(row => (
              <TableRow key={row.id}>
                {shownColumns.map(col => (
                  <TableCell key={col.key} onDoubleClick={() => startEdit(row)}>
                    {editingId === row.id ? (
                      <TextField
                        value={editBuffer[col.key] ?? ''}
                        onChange={e => setEditBuffer(prev => ({ ...prev, [col.key]: e.target.value }))}
                        size="small"
                      />
                    ) : String(row[col.key] ?? '')}
                  </TableCell>
                ))}
                <TableCell>
                  {editingId === row.id ? (
                    <>
                      <IconButton size="small" onClick={saveEdit}><Save fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={cancelEdit}><Close fontSize="small" /></IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton size="small" onClick={() => startEdit(row)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { if (confirm('Delete this row?')) dispatch(deleteRow(row.id)) }}><Delete fontSize="small" /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={processed.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />

      <ManageColumnsModal open={isColModalOpen} onClose={() => setColModalOpen(false)} />
    </Paper>
  )
}
