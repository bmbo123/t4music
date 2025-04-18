'use client'
import { motion }       from 'framer-motion'
import { useState,
         useEffect,
         useCallback }   from 'react'

const months = [
  'January 2024','February 2024','March 2024','April 2024',
  'May 2024','June 2024','July 2024','August 2024',
  'September 2024','October 2024','November 2024','December 2024',
  'January 2025','February 2025','March 2025','April 2025',
]

interface Signup {
  user_id:    number
  username:   string
  email:      string
  created_at: string
}

export default function NewSignupsTable() {
  const [period, setPeriod]       = useState(months[15])
  const [count, setCount]         = useState<number|null>(null)
  const [signups, setSignups]     = useState<Signup[]>([])
  const [loading, setLoading]     = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/adminpage/new-signups', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ period })
      })
      const json = await res.json()
      setCount(json.count ?? 0)
      setSignups(json.signups ?? [])
    } catch (e) {
      console.error('fetch new signups failed', e)
      setCount(0)
      setSignups([])
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        New Sign‑ups
      </h2>

      {/* Month selector */}
      <div className="flex justify-end mb-4">
        <select
          className="styled-dropdown"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          {months.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Summary row */}
      <table className="table-auto w-full text-center mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800">
            <td className="p-2">{period}</td>
            <td className="p-2">{loading ? '…' : count}</td>
          </tr>
        </tbody>
      </table>

      {/* Detailed list */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Sign‑up Date</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s, i) => (
              <tr key={s.user_id} className={i % 2 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="px-4 py-2">{s.username.replace(/\./g,' ')}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!loading && signups.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-400">
                  No new sign‑ups in {period}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
