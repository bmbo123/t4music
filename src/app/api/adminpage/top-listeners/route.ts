import { NextResponse } from 'next/server'
import { prisma }       from '../../../../../prisma/script'

function parsePeriod(input: string) {
  const [monthName, yearStr] = input.split(' ')
  const start = new Date(`${monthName} 1, ${yearStr}`)
  const end   = new Date(start.getFullYear(), start.getMonth() + 1, 1)
  return { start, end }
}

export async function POST(req: Request) {
  try {
    const { period }     = await req.json()
    const { start, end } = parsePeriod(period)

    // Raw SQL: count plays and sum hours per listener in period
    const rows = await prisma.$queryRaw<
      Array<{
        user_id: number
        username: string
        plays: number
        streamingHours: number
      }>
    >`
      SELECT
        u.user_id,
        u.username,
        COUNT(sp.id)                                AS plays,
        COALESCE(SUM(s.duration) / 3600.0, 0)        AS streamingHours
      FROM users u
      LEFT JOIN song_plays sp
        ON sp.user_id = u.user_id
        AND sp.played_at BETWEEN ${start} AND ${end}
      LEFT JOIN songs s
        ON s.song_id = sp.song_id
      WHERE u.role = 'listener'
      GROUP BY u.user_id, u.username
      ORDER BY plays DESC
      LIMIT 50;
    `

    return NextResponse.json({ listeners: rows })
  } catch (e) {
    console.error('top-listeners error', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
