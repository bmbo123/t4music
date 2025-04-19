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
    const { period, role } = await req.json() as {
      period: string,
      role?: 'listener' | 'artist' | 'admin'
    }
    const { start, end } = parsePeriod(period)

    const where = {
      created_at: { gte: start, lt: end },
      ...(role ? { role } : {})
    };

    const signups = await prisma.users.findMany({
      where,
      select: {
        user_id:    true,
        username:   true,
        email:      true,
        role:       true,    
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({
      count:   signups.length,
      signups
    })
  } catch (e) {
    console.error('new-signups error', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
