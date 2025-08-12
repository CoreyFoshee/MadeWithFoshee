import { getAdminDb } from './admin'

// Sample data for initialization
const sampleListings = [
  {
    id: 'lake-house-001',
    name: 'Beautiful Lake House',
    description: 'A stunning lakefront property perfect for family getaways',
    location: 'Lake Tahoe, CA',
    price_per_night: 250,
    max_guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Lake View', 'Dock Access', 'Fireplace', 'Full Kitchen', 'WiFi'],
    images: [
      '/lake-house-living-room.png',
      '/lake-house-bedroom.png',
      '/lake-house-kitchen.png',
      '/lake-house-dock.png'
    ],
    created_at: new Date(),
    updated_at: new Date()
  }
]

const sampleContentBlocks = [
  {
    id: 'hero-section',
    title: 'Welcome to Our Lake House',
    content: 'Experience the perfect blend of luxury and nature at our beautiful lakefront property.',
    type: 'hero',
    order: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'about-section',
    title: 'About Our Property',
    content: 'Nestled on the shores of a pristine lake, our house offers breathtaking views and modern amenities.',
    type: 'content',
    order: 2,
    created_at: new Date(),
    updated_at: new Date()
  }
]

const sampleSiteSettings = {
  id: 'main-settings',
  site_name: 'Made With Foshee',
  contact_email: 'booking@madewithfoshee.com',
  phone: '+1 (555) 123-4567',
  address: '123 Lake View Drive, Lake Tahoe, CA 96150',
  created_at: new Date(),
  updated_at: new Date()
}

export async function initializeFirestore() {
  const adminDb = getAdminDb()
  
  try {
    console.log('🚀 Initializing Firestore with sample data...')

    // Initialize listings
    for (const listing of sampleListings) {
      await adminDb.collection('listings').doc(listing.id).set(listing)
      console.log(`✅ Added listing: ${listing.name}`)
    }

    // Initialize content blocks
    for (const block of sampleContentBlocks) {
      await adminDb.collection('content_blocks').doc(block.id).set(block)
      console.log(`✅ Added content block: ${block.title}`)
    }

    // Initialize site settings
    await adminDb.collection('site_settings').doc(sampleSiteSettings.id).set(sampleSiteSettings)
    console.log(`✅ Added site settings: ${sampleSiteSettings.site_name}`)

    console.log('🎉 Firestore initialization completed successfully!')
    return { success: true, message: 'Firestore initialized with sample data' }
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error)
    return { success: false, error: error.message }
  }
}

export async function clearAllData() {
  const adminDb = getAdminDb()
  
  try {
    console.log('🧹 Clearing all Firestore data...')

    // Clear listings
    const listingsSnapshot = await adminDb.collection('listings').get()
    for (const doc of listingsSnapshot.docs) {
      await doc.ref.delete()
    }
    console.log('✅ Cleared listings')

    // Clear content blocks
    const contentSnapshot = await adminDb.collection('content_blocks').get()
    for (const doc of contentSnapshot.docs) {
      await doc.ref.delete()
    }
    console.log('✅ Cleared content blocks')

    // Clear site settings
    const settingsSnapshot = await adminDb.collection('site_settings').get()
    for (const doc of settingsSnapshot.docs) {
      await doc.ref.delete()
    }
    console.log('✅ Cleared site settings')

    console.log('🎉 All data cleared successfully!')
    return { success: true, message: 'All data cleared' }
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    return { success: false, error: error.message }
  }
}
