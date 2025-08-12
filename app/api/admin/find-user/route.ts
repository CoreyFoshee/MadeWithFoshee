import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 })
    }

    console.log('Looking for user with email:', email)

    const adminDb = getAdminDb()
    
    // Search for user by email in profiles collection
    const profileQuery = await adminDb.collection('profiles').where('email', '==', email).get()
    
    if (!profileQuery.empty) {
      const profile = profileQuery.docs[0].data()
      return NextResponse.json({ 
        success: true, 
        message: 'User profile found',
        profile: {
          id: profileQuery.docs[0].id,
          ...profile
        }
      })
    }

    // If no profile found, return message
    return NextResponse.json({ 
      success: false, 
      message: `No profile found for email: ${email}`,
      suggestion: 'You may need to create a profile for this user'
    })

  } catch (error) {
    console.error('Error finding user:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
