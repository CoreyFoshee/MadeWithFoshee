import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 })
    }

    console.log('Deleting profile for email:', email)

    const adminDb = getAdminDb()
    
    // Find and delete profile by email
    const profileQuery = await adminDb.collection('profiles').where('email', '==', email).get()
    
    if (profileQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        message: `No profile found for email: ${email}` 
      })
    }

    // Delete all profiles with this email (should only be one)
    const deletePromises = profileQuery.docs.map(doc => doc.ref.delete())
    await Promise.all(deletePromises)

    return NextResponse.json({ 
      success: true, 
      message: `Profile(s) deleted successfully for email: ${email}`,
      deletedCount: profileQuery.docs.length
    })

  } catch (error) {
    console.error('Error deleting profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
