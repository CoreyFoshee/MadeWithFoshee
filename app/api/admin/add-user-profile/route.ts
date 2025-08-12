import { NextResponse } from 'next/server'
import { createOrUpdateUserProfile } from '@/lib/firebase/admin-database'

export async function POST(request: Request) {
  try {
    const { userId, firstName, lastName, email } = await request.json()

    if (!userId || !firstName || !lastName || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: userId, firstName, lastName, email' 
      }, { status: 400 })
    }

    console.log('Adding profile for user:', { userId, firstName, lastName, email })

    const result = await createOrUpdateUserProfile(userId, {
      first_name: firstName,
      last_name: lastName,
      email: email
    })

    return NextResponse.json({ 
      success: true, 
      message: 'User profile added/updated successfully',
      result
    })
  } catch (error) {
    console.error('Error adding user profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
