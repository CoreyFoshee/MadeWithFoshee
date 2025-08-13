import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/firebase/auth'
import { checkAdminPrivileges } from '@/lib/firebase/admin-database'

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check admin privileges
    const isAdmin = await checkAdminPrivileges(userId)
    
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error checking admin privileges:', error)
    return NextResponse.json({ error: 'Failed to check admin privileges' }, { status: 500 })
  }
}
