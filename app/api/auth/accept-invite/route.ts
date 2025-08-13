import { NextRequest, NextResponse } from 'next/server'
import { acceptInvitation } from '@/lib/invitations'

export async function POST(request: NextRequest) {
  try {
    const { token, userId } = await request.json()

    if (!token || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token and user ID are required' 
      }, { status: 400 })
    }

    // Accept invitation
    const result = await acceptInvitation(token, userId)

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation accepted successfully'
    })
  } catch (error) {
    console.error('Error in accept-invite API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
