import { NextResponse } from 'next/server'
import { checkAdminPrivileges } from '@/lib/firebase/admin-database'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    console.log('Checking admin privileges for user:', userId)

    const isAdmin = await checkAdminPrivileges(userId)
    
    return NextResponse.json({ 
      success: true, 
      userId,
      isAdmin,
      message: isAdmin ? 'User has admin privileges' : 'User does not have admin privileges'
    })

  } catch (error) {
    console.error('Error checking admin privileges:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
