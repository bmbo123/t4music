'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const months = [
  'January 2024','February 2024','March 2024','April 2024',
  'May 2024','June 2024','July 2024','August 2024',
  'September 2024','October 2024','November 2024','December 2024',
  'January 2025','February 2025','March 2025','April 2025','May 2025',
]

interface Signup {
  user_id:    number
  username:   string
  email:      string
  role:       'listener' | 'artist' | 'admin'
  created_at: string
}

export default function NewSignupsTable() {
  const [period, setPeriod]       = useState(months[15])
  const [signups, setSignups]     = useState<Signup[]>([])
  const [loading, setLoading]     = useState(true)
  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({
    labels: [],
    datasets: [
      { label: 'Listeners', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 },
      { label: 'Artists',   data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }
    ]
  })

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#ffffff', font: { weight: 'bold' } },
        grid:  { color: 'rgba(255,255,255,0.2)' }
      },
      y: {
        beginAtZero: true,
        ticks:       { color: '#ffffff', font: { weight: 'bold' } },
        grid:        { color: 'rgba(255,255,255,0.2)' }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels:   { color: '#9932CC', font: { weight: 'bold' } }
      },
      title: {
        display: true,
        text:    `Sign‑ups in ${period.split(' ')[1]}`,
        color:   '#9932CC',
        font:    { size: 18, weight: 'bold' }
      }
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {

      const detailRes  = await fetch('/api/adminpage/new-signups', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ period })
      })
      const detailJson = await detailRes.json()
      setSignups(detailJson.signups ?? [])


      const year         = period.split(' ')[1]
      const monthsOfYear = months.filter(m => m.endsWith(year))
      const selectedIndex = monthsOfYear.findIndex(m => m === period)

      const fetchCount = (m: string, role: 'listener'|'artist') =>
        fetch('/api/adminpage/new-signups', {
          method:  'POST',
          headers: { 'Content-Type':'application/json' },
          body:    JSON.stringify({ period: m, role })
        })
        .then(r => r.json())
        .then(j => j.count ?? 0)

      const [listenerCounts, artistCounts] = await Promise.all([
        Promise.all(monthsOfYear.map(m => fetchCount(m, 'listener'))),
        Promise.all(monthsOfYear.map(m => fetchCount(m, 'artist')))
      ])

      const neonL       = 'rgba(100,149,237,0.6)', borderL    = 'rgba(100,149,237,1)'
      const neonA       = 'rgba(138,43,226,0.6)',   borderA    = 'rgba(138,43,226,1)'
      const highlightL = 'rgba(173,216,230,0.9)'  
      const highlightA = 'rgba(216,191,216,0.9)'  

      const bgL = listenerCounts.map((_, i) =>
        i === selectedIndex ? highlightL : neonL
      )
      const bdL = listenerCounts.map((_, i) =>
        i === selectedIndex ? highlightL : borderL
      )
      const bgA = artistCounts.map((_, i) =>
        i === selectedIndex ? highlightA : neonA
      )
      const bdA = artistCounts.map((_, i) =>
        i === selectedIndex ? highlightA : borderA
      )

      setChartData({
        labels: monthsOfYear.map(m => m.split(' ')[0]),
        datasets: [
          {
            label:           'Listeners',
            data:            listenerCounts,
            backgroundColor: bgL,
            borderColor:     bdL,
            borderWidth:     2
          },
          {
            label:           'Artists',
            data:            artistCounts,
            backgroundColor: bgA,
            borderColor:     bdA,
            borderWidth:     2
          }
        ]
      })
    } catch (e) {
      console.error('fetch new signups failed', e)
      setSignups([])
      setChartData({
        labels: [],
        datasets: [
          { label:'Listeners', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 },
          { label:'Artists',   data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => { fetchData() }, [fetchData])

  // Derive monthly totals
  const listenerTotal = signups.filter(s => s.role === 'listener').length
  const artistTotal   = signups.filter(s => s.role === 'artist').length
  const totalCount    = signups.length

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

      {/* Period Filter */}
      <div className="mb-4">
        <select
          className="styled-dropdown max-w-xs"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          {months.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-[500px] mb-2">
        <Bar data={chartData} options={options} />
      </div>

      {/* Selected Month */}
      <div className="text-center mb-2">
        <span className="text-white text-lg font-semibold">{period}</span>
      </div>

      {/* Totals */}
      <div className="flex justify-center space-x-6 mb-6">
        <div className="text-white font-bold">Listeners: {listenerTotal}</div>
        <div className="text-white font-bold">Artists:   {artistTotal}</div>
        <div className="text-white font-bold">Total:     {totalCount}</div>
      </div>

      {/* Detail Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[640px] overflow-y-auto custom-scrollbar">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-white font-bold">#</th>
                <th className="px-4 py-2 text-white font-bold">ID</th>
                <th className="px-4 py-2 text-white font-bold">Username</th>
                <th className="px-4 py-2 text-white font-bold">Email</th>
                <th className="px-4 py-2 text-white font-bold">Role</th>
                <th className="px-4 py-2 text-white font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((u, i) => (
                <tr
                  key={u.user_id}
                  className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
                >
                  <td className="px-4 py-2 text-white">{i + 1}</td>
                  <td className="px-4 py-2 text-white">{u.user_id}</td>
                  <td className="px-4 py-2 text-white">{u.username.replace(/\./g,' ')}</td>
                  <td className="px-4 py-2 text-white truncate">{u.email}</td>
                  <td className="px-4 py-2 text-white uppercase">{u.role}</td>
                  <td className="px-4 py-2 text-white">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!loading && signups.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    No new sign‑ups in {period}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
