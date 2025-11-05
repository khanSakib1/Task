import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import type { Row, Column } from '../store/tableSlice'

// export current rows (visible columns only)
export function exportToCsv(rows: Row[], columns: Column[], filename = 'table-export.csv') {
  const shown = columns.filter(c => c.visible)
  const header = shown.map(c => c.label)
  const data = rows.map(r => shown.map(col => r[col.key] ?? ''))
  const csv = Papa.unparse({ fields: header, data })
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

export function parseCsv(file: File): Promise<{ data: any[], errors: any[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve({ data: results.data as any[], errors: results.errors }),
      error: err => reject(err),
    })
  })
}
