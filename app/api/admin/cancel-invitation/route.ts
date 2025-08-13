import { NextRequest, NextResponse } from 'next/server'
import { cancelInvitation } from '@/lib/invitations'
import { checkAdminPrivileges } from '@/lib/firebase/admin-database'

export async function DELETE(request: NextRequest) {
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

    const { invitationId } = await request.json()

    if (!invitationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invitation ID is required' 
      }, { status: 400 })
    }

    // Cancel invitation
    const result = await cancelInvitation(invitationId)

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation cancelled successfully'
    })
  } catch (error) {
    console.error('Error in cancel-invitation API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
