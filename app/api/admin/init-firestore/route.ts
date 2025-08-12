import { NextRequest, NextResponse } from 'next/server'
import { initializeFirestore, clearAllData } from '@/lib/firebase/admin-database'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'init') {
      console.log('🚀 Initializing Firestore...')
      await initializeFirestore()
      return NextResponse.json({ success: true, message: 'Firestore initialized successfully' })
    }
    
    if (action === 'clear') {
      console.log('🗑️ Clearing Firestore data...')
      await clearAllData()
      return NextResponse.json({ success: true, message: 'All data cleared successfully' })
    }
    
    return NextResponse.json({ success: false, message: 'Invalid action. Use "init" or "clear"' })
    
  } catch (error) {
    console.error('❌ Error in admin API:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to perform action', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin API endpoint. Use POST with action: "init" or "clear"' 
  })
}

