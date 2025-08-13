import { NextResponse } from 'next/server'
import { grantAdminRole } from '@/lib/firebase/admin-database'

export async function POST(request: Request) {
  try {
    const { userId, adminUserId } = await request.json()

    if (!userId || !adminUserId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: userId, adminUserId' 
      }, { status: 400 })
    }

    console.log('Granting admin role to user:', userId, 'by admin:', adminUserId)

    const result = await grantAdminRole(userId, adminUserId)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message 
      }, { status: 403 })
    }

  } catch (error) {
    console.error('Error granting admin role:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
