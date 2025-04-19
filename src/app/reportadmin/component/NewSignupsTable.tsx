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
  'January 2025','February 2025','March 2025','April 2025', 'May 2025',
]

interface Signup {
  user_id: number
  username: string
  email: string
  created_at: string
}

export default function NewSignupsTable() {
  const [period, setPeriod] = useState(months[15])
  const [count, setCount] = useState<number | null>(null)
  const [signups, setSignups] = useState<Signup[]>([])
  const [loading, setLoading] = useState(true)

  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({
    labels: [],
    datasets: [{
      label: 'Sign-ups',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(153,50,204,0.9)'
    }]
  })

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#9932CC' } },
      title: { display: true, text: `Sign-ups in ${period.split(' ')[1]}`, color: '#9932CC' }
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/adminpage/new-signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      })
      const json = await res.json()
      setCount(json.count ?? 0)
      setSignups(json.signups ?? [])

      const year = period.split(' ')[1]
      const monthsOfYear = months.filter(m => m.endsWith(year))
      const counts = await Promise.all(
        monthsOfYear.map(async m => {
          const r = await fetch('/api/adminpage/new-signups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period: m })
          })
          const j = await r.json()
          return j.count ?? 0
        })
      )
      const neonBg = 'rgba(153,50,204,0.6)'
      const neonBorder = 'rgba(153,50,204,1)'
      const bgColors = counts.map(() => neonBg)
      const bdColors = counts.map(() => neonBorder)

      setChartData({
        labels: monthsOfYear.map(m => m.split(' ')[0]),
        datasets: [{
          label: 'Sign-ups',
          data: counts,
          backgroundColor: bgColors,
          borderColor: bdColors,
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(153,50,204,0.9)'
        }]
      })
    } catch (e) {
      console.error('fetch new signups failed', e)
      setCount(0)
      setSignups([])
      setChartData({ labels: [], datasets: [{ label: 'Sign-ups', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }] })
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

      {/* Filter above the graph */}
      <div className="mb-4">
        <select
          className="styled-dropdown max-w-xs"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          {months.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Yearly bar chart (blue-purple neon) */}
      <div className="w-full h-[500px] mb-6">
        <Bar
          data={chartData}
          options={options}
        />
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

      {/* Detailed list with vertical scroll */}
      <div className="overflow-x-auto">
        <div className="max-h-[640px] overflow-y-auto custom-scrollbar">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Sign‑up Date</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s, i) => (
                <tr key={s.user_id} className={i % 2 ? 'bg-gray-800' : 'bg-gray-900'}>
                  <td className="px-4 py-2">{s.user_id}</td>
                  <td className="px-4 py-2">{s.username.replace(/\./g, ' ')}</td>
                  <td className="px-4 py-2 truncate">{s.email}</td>
                  <td className="px-4 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!loading && signups.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">
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
