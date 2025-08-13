import { NextRequest, NextResponse } from 'next/server'
import { getInvitationByToken } from '@/lib/invitations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invitation token is required' 
      }, { status: 400 })
    }

    // Validate invitation
    const invitation = await getInvitationByToken(token)

    if (!invitation) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired invitation' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        fullName: invitation.fullName,
        inviterName: invitation.inviterName,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt
      }
    })
  } catch (error) {
    console.error('Error in validate-invite API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
