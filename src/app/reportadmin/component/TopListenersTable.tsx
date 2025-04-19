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

interface TopListener {
  user_id:        number
  username:       string
  email:          string
  plays:          number
  streamingHours: number
}

export default function TopListenersTable() {
  const [period, setPeriod] = useState(months[15])
  const [data, setData]     = useState<TopListener[]>([])
  const [loading, setLoading] = useState(true)

  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({
    labels: [],
    datasets: [{ label: 'Streamed Hours', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }]
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
        text:    `Streamed Hours in ${period.split(' ')[1]}`,
        color:   '#9932CC',
        font:    { size: 18, weight: 'bold' }
      }
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/adminpage/top-listeners', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ period })
      })
      const json = await res.json()
      setData(json.listeners ?? [])

      const year         = period.split(' ')[1]
      const monthsOfYear = months.filter(m => m.endsWith(year))
      const selectedIndex = monthsOfYear.findIndex(m => m === period)

      const totals: number[] = await Promise.all(
        monthsOfYear.map(async m => {
          const r = await fetch('/api/adminpage/top-listeners', {
            method:  'POST',
            headers: { 'Content-Type':'application/json' },
            body:    JSON.stringify({ period: m })
          })
          const j = await r.json()
          return (j.listeners ?? []).reduce((sum: number, u: TopListener) =>
            sum + (u.streamingHours ?? 0), 0
          )
        })
      )

      const baseBg     = 'rgba(153,50,204,0.6)'
      const baseBorder = 'rgba(153,50,204,1)'
      const hlBg       = 'rgba(255,105,180,0.9)'  
      const hlBorder   = 'rgba(255,105,180,1)'

      const bgColors = totals.map((_, i) =>
        i === selectedIndex ? hlBg : baseBg
      )
      const bdColors = totals.map((_, i) =>
        i === selectedIndex ? hlBorder : baseBorder
      )

      setChartData({
        labels: monthsOfYear.map(m => m.split(' ')[0]),
        datasets: [{
          label:           'Streamed Hours',
          data:            totals,
          backgroundColor: bgColors,
          borderColor:     bdColors,
          borderWidth:     2,
          hoverBackgroundColor: hlBg
        }]
      })
    } catch (e) {
      console.error('fetch top listeners failed', e)
      setData([])
      setChartData({
        labels: [],
        datasets: [{ label:'Streamed Hours', data:[], backgroundColor:[], borderColor:[], borderWidth:2 }]
      })
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => { fetchData() }, [fetchData])

  const labels = chartData.labels as string[]
  const selectedIndex = labels.findIndex(label =>
    label === period.split(' ')[0]
  )
  const selectedTotal = (chartData.datasets[0]?.data?.[selectedIndex] as number) || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2 text-white">
        Top Listeners
      </h2>

      {/* Filter */}
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

      {/* Selected Month Total */}
      <div className="text-center mb-6">
        <span className="text-white font-bold">
          Total Streamed Hours: {selectedTotal.toFixed(1)}
        </span>
      </div>

      {/* Detail Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[640px] overflow-y-auto custom-scrollbar">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Plays</th>
                <th className="px-4 py-2">Streamed Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u, i) => (
                <tr
                  key={u.user_id}
                  className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
                >
                  <td className="px-4 py-2 text-white">{i + 1}</td>
                  <td className="px-4 py-2 text-white">{u.user_id}</td>
                  <td className="px-4 py-2 text-white">{u.username.replace(/\./g,' ')}</td>
                  <td className="px-4 py-2 text-white truncate">{u.email}</td>
                  <td className="px-4 py-2 text-white">{u.plays}</td>
                  <td className="px-4 py-2 text-white">{u.streamingHours.toFixed(1)}</td>
                </tr>
              ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    No plays recorded in {period}.
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
