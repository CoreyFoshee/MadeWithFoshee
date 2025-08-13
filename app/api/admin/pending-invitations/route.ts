import { NextRequest, NextResponse } from 'next/server'
import { getPendingInvitations } from '@/lib/invitations'
import { checkAdminPrivileges } from '@/lib/firebase/admin-database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (you'll need to implement auth middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Check admin privileges
    const hasPrivileges = await checkAdminPrivileges(userId)
    if (!hasPrivileges) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 403 })
    }

    // Get pending invitations
    const invitations = await getPendingInvitations()

    return NextResponse.json({ 
      success: true, 
      invitations
    })
  } catch (error) {
    console.error('Error in pending-invitations API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
