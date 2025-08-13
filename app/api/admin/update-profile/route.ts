import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function PATCH(request: Request) {
  try {
    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID and updates are required' 
      }, { status: 400 })
    }

    console.log('Updating profile for user:', userId, 'with updates:', updates)

    const adminDb = getAdminDb()
    
    // Find and update profile
    const profileQuery = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    if (profileQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        message: `No profile found for user ID: ${userId}` 
      })
    }

    const profileDoc = profileQuery.docs[0]
    const updateData = {
      ...updates,
      updated_at: new Date()
    }
    
    await profileDoc.ref.update(updateData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      updatedFields: Object.keys(updates)
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
