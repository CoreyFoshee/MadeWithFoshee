const { execSync } = require('child_process')

// Load environment variables
require('dotenv').config()

console.log('🧪 Testing server action...')
console.log('Environment variables:')
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set')
console.log('ADMIN_APPROVAL_TOKEN:', process.env.ADMIN_APPROVAL_TOKEN ? 'Set' : 'Not set')
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set')

// Test data
const testBookingData = {
  listing_id: 'test-listing-123',
  listing_name: 'Family Lake House',
  user_id: 'test-user-123',
  start_date: '2025-01-15',
  end_date: '2025-01-18',
  guests: 4,
  notes: 'Test booking for debugging',
  status: 'pending',
  guest_name: 'Test User',
  guest_email: 'corey@cfdesign.studio'
}

console.log('\n📝 Test booking data:')
console.log(JSON.stringify(testBookingData, null, 2))

console.log('\n🚀 Starting development server...')
console.log('Please create a test booking in the browser and check the console for logs.')
console.log('The server action should now have detailed logging to help debug the issue.')
