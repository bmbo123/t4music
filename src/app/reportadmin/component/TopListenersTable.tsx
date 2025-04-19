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

interface TopListener {
  user_id:        number
  username:       string
  email:          string
  plays:          number
  streamingHours: number
}

export default function TopListenersTable() {
  const [period, setPeriod]   = useState(months[15])
  const [data, setData]       = useState<TopListener[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/adminpage/top-listeners', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ period })
      })
      const json = await res.json()
      setData(json.listeners ?? [])
    } catch (e) {
      console.error('fetch top listeners failed', e)
      setData([])
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
        Top Listeners
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-white">#</th>
              <th className="px-4 py-2 text-white">Username</th>
              <th className="px-4 py-2 text-white">Email</th>
              <th className="px-4 py-2 text-white">Plays</th>
              <th className="px-4 py-2 text-white">Streamed Hours</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={u.user_id}
                  className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="px-4 py-2 text-white">{i + 1}</td>
                <td className="px-4 py-2 text-white">{u.username.replace(/\./g,' ')}</td>
                <td className="px-4 py-2 text-white truncate">{u.email}</td>
                <td className="px-4 py-2 text-white">{u.plays}</td>
                <td className="px-4 py-2 text-white">{u.streamingHours.toFixed(1)}</td>
              </tr>
            ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">
                  No plays recorded in {period}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
