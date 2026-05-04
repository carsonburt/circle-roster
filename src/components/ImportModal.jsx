import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { useChapter } from '../contexts/ChapterContext'

function headerToField(header) {
  const h = header.toLowerCase().trim().replace(/[^a-z ]/g, '')
  if (h.includes('first')) return 'first_name'
  if (h.includes('last')) return 'last_name'
  if (h.includes('email')) return 'email'
  if (h.includes('phone')) return 'phone'
  if (h.includes('status')) return 'status'
  if (h.includes('cohort') || h.includes('pledge')) return 'pledge_class'
  if (h.includes('year') || h.includes('grad')) return 'class_year'
  if (h.includes('big') || h.includes('mentor')) return 'big_name'
  if (h.includes('linkedin')) return 'linkedin_url'
  if (h.includes('major') || h.includes('minor')) return 'major'
  if (h.includes('high school') || h.includes('highschool')) return 'high_school'
  return null
}

function parseRows(rawRows, existingMembers) {
  if (!rawRows || rawRows.length < 2) return []

  const headers = rawRows[0].map(h => String(h ?? ''))
  const fieldMap = headers.map(headerToField)

  return rawRows
    .slice(1)
    .filter(row => row && row.some(cell => cell !== '' && cell !== null && cell !== undefined))
    .map((row, index) => {
      const member = {
        first_name: '', last_name: '', email: '', phone: '',
        status: 'active', pledge_class: '', class_year: '',
        big_name: '', linkedin_url: '', major: '', high_school: '',
        _rowIndex: index + 2,
      }

      fieldMap.forEach((field, i) => {
        if (field && row[i] !== undefined && row[i] !== null) {
          member[field] = String(row[i]).trim()
        }
      })

      const s = member.status.toLowerCase()
      member.status = s === 'alumni' || s === 'former' ? 'alumni' : s === 'inactive' ? 'inactive' : 'active'

      const yearNum = parseInt(member.class_year)
      member.class_year = yearNum > 1900 && yearNum < 2100 ? yearNum : null

      if (member.big_name) {
        const lower = member.big_name.toLowerCase()
        const found = existingMembers.find(m =>
          `${m.first_name} ${m.last_name}`.toLowerCase() === lower
        )
        member.big_id = found?.id || null
        member._bigNotFound = !found
      } else {
        member.big_id = null
        member._bigNotFound = false
      }

      const errors = []
      if (!member.first_name) errors.push('Missing first name')
      if (!member.last_name) errors.push('Missing last name')
      member._errors = errors
      member._valid = errors.length === 0

      return member
    })
}

export default function ImportModal({ onClose }) {
  const { members, addMember, terminology: t } = useChapter()
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [done, setDone] = useState(false)
  const [importCount, setImportCount] = useState(0)
  const fileRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setRows([])
    try {
      let rawRows
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text()
        const wb = XLSX.read(text, { type: 'string' })
        rawRows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
      } else {
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        rawRows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
      }
      setRows(parseRows(rawRows, members))
    } catch {
      alert('Could not read that file. Please use the downloaded template and save as .xlsx or .csv')
      setFileName('')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function downloadTemplate() {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone',
      'Status', 'Cohort', 'Class Year', 'Big (Full Name)', 'LinkedIn URL',
      'Major / Minor', 'High School',
    ]
    const example = [
      'Jane', 'Smith', 'jane.smith@email.com', '(555) 123-4567',
      'active', 'Fall 2025', '2029', 'James Whitfield', 'linkedin.com/in/janesmith',
      'Finance / Economics', 'Lincoln High School',
    ]
    const ws = XLSX.utils.aoa_to_sheet([headers, example])
    ws['!cols'] = headers.map(() => ({ wch: 18 }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Members')
    XLSX.writeFile(wb, 'member-import-template.xlsx')
  }

  function handleImport() {
    const valid = rows.filter(r => r._valid)
    valid.forEach(r => {
      addMember({
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email || '',
        phone: r.phone || '',
        status: r.status,
        pledge_class: r.pledge_class || '',
        class_year: r.class_year,
        linkedin_url: r.linkedin_url || '',
        major: r.major || '',
        high_school: r.high_school || '',
        big_id: r.big_id,
        show_email: true,
        show_phone: true,
        show_linkedin: false,
        avatar_url: null,
      })
    })
    setImportCount(valid.length)
    setDone(true)
  }

  const validRows = rows.filter(r => r._valid)
  const invalidRows = rows.filter(r => !r._valid)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10 flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Import {t.members} from Excel</h3>
            <p className="text-sm text-slate-500 mt-0.5">Upload a spreadsheet to add multiple members at once</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none ml-4 mt-0.5">×</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {done ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-4">✓</div>
              <h4 className="text-xl font-bold text-slate-900">Import complete</h4>
              <p className="text-slate-500 mt-2">
                {importCount} {t.members.toLowerCase()} added successfully
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Step 1 — template */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-blue-900">Step 1 — Download the template</p>
                  <p className="text-xs text-blue-600 mt-0.5">Fill it in, then upload below. Column headers must match.</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex-shrink-0 ml-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  ↓ Template
                </button>
              </div>

              {/* Step 2 — upload */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Step 2 — Upload your file</p>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    dragging
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                  />
                  {fileName ? (
                    <div>
                      <div className="text-4xl mb-2">📊</div>
                      <p className="font-semibold text-slate-700">{fileName}</p>
                      <p className="text-sm text-slate-400 mt-1">{rows.length} data rows found · click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📂</div>
                      <p className="font-semibold text-slate-600">Drag & drop or click to browse</p>
                      <p className="text-sm text-slate-400 mt-1">Accepts .xlsx, .xls, .csv</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — preview */}
              {rows.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Step 3 — Review & import</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-600 font-medium">✓ {validRows.length} ready</span>
                      {invalidRows.length > 0 && (
                        <span className="text-red-500 font-medium">✗ {invalidRows.length} with errors</span>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs min-w-[540px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
                            <th className="w-8 px-2 py-2.5" />
                            <th className="px-3 py-2.5 font-semibold">First</th>
                            <th className="px-3 py-2.5 font-semibold">Last</th>
                            <th className="px-3 py-2.5 font-semibold">Email</th>
                            <th className="px-3 py-2.5 font-semibold">Status</th>
                            <th className="px-3 py-2.5 font-semibold">Cohort</th>
                            <th className="px-3 py-2.5 font-semibold">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <tr
                              key={i}
                              className={`border-b border-slate-100 last:border-0 ${row._valid ? '' : 'bg-red-50'}`}
                            >
                              <td className="px-2 py-2 text-center">
                                {row._valid
                                  ? <span className="text-green-500 font-bold">✓</span>
                                  : <span className="text-red-400 font-bold">✗</span>
                                }
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {row.first_name || <span className="text-red-400 italic">missing</span>}
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {row.last_name || <span className="text-red-400 italic">missing</span>}
                              </td>
                              <td className="px-3 py-2 text-slate-500 max-w-[140px] truncate">
                                {row.email || <span className="text-slate-300">—</span>}
                              </td>
                              <td className="px-3 py-2">
                                <span className={`px-1.5 py-0.5 rounded font-medium ${
                                  row.status === 'active'   ? 'bg-green-100 text-green-700' :
                                  row.status === 'alumni'   ? 'bg-blue-100 text-blue-700' :
                                                              'bg-slate-100 text-slate-500'
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-slate-500">
                                {row.pledge_class || <span className="text-slate-300">—</span>}
                              </td>
                              <td className="px-3 py-2 text-slate-400 italic">
                                {row._errors?.length > 0
                                  ? <span className="text-red-400">{row._errors[0]}</span>
                                  : row._bigNotFound
                                    ? `Big "${row.big_name}" not found`
                                    : ''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!done && rows.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white flex-shrink-0 rounded-b-2xl">
            <p className="text-xs text-slate-400">
              {invalidRows.length > 0
                ? `${invalidRows.length} row${invalidRows.length > 1 ? 's' : ''} with errors will be skipped`
                : `All ${validRows.length} rows ready to import`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={validRows.length === 0}
                className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Import {validRows.length} {t.members.toLowerCase()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
