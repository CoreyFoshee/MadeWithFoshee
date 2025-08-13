import { NextRequest, NextResponse } from 'next/server'
import { createInvitation } from '@/lib/invitations'
import { checkAdminPrivileges } from '@/lib/firebase/admin-database'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const email = formData.get('email')?.toString()
    const fullName = formData.get('fullName')?.toString()

    if (!email || !fullName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and full name are required' 
      }, { status: 400 })
    }

    // Get inviter's name
    const { getAdminDb } = await import('@/lib/firebase/admin')
    const adminDb = getAdminDb()
    const inviterProfile = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    const inviterName = inviterProfile.empty ? 'Property Owner' : inviterProfile.docs[0].data().full_name || 'Property Owner'

    // Create invitation
    const result = await createInvitation(email, fullName, userId, inviterName)

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Invitation sent to ${email}!`,
      invitation: result.invitation
    })
  } catch (error) {
    console.error('Error in invite-user API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
