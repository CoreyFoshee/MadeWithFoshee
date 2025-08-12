import { NextRequest, NextResponse } from 'next/server'
import { initializeFirestore, clearAllData } from '@/lib/firebase/admin-database'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'init') {
      console.log('🚀 Initializing Firestore...')
      const result = await initializeFirestore()
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Firestore initialized successfully' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: result.error 
        }, { status: 500 })
      }
    } else if (action === 'clear') {
      console.log('🧹 Clearing Firestore data...')
      const result = await clearAllData()
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'All data cleared successfully' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: result.error 
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid action. Use "init" or "clear"' 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Error in init-firestore API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin API endpoint. Use POST with action: "init" or "clear"' 
  })
}

