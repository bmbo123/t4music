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

    const signups = await prisma.users.findMany({
      where: {
        role: 'listener',
        created_at: {
          gte: start,
          lt:  end
        }
      },
      select: {
        user_id:    true,
        username:   true,
        email:      true,
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
