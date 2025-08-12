import { adminDb } from './admin'
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  addDoc, 
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase-admin/firestore'

interface ContentBlock {
  id: string
  title: string
  content: string
  position: number
  type: string
}

interface Listing {
  id: string
  name: string
  description: string
  max_guests: number
  min_nights: number
  price_per_night: number
}

// Initialize Firestore with sample data
export async function initializeFirestore() {
  try {
    console.log('🚀 Starting Firestore initialization with Admin SDK...')

    // Sample data
    const sampleData = {
      listings: [
        {
          id: 'default',
          name: 'Family Lake House',
          description: 'Beautiful family lake house with stunning views and direct lake access. Perfect for family getaways with 4 bedrooms, 3 bathrooms, and a private dock.',
          max_guests: 8,
          min_nights: 2,
          price_per_night: 250,
          amenities: ['WiFi', 'Parking', 'Lake Access', 'Private Dock', 'Full Kitchen', '4 Bedrooms', '3 Bathrooms'],
          images: [
            '/lake-house-dock.png',
            '/lake-house-living-room.png',
            '/lake-house-bedroom.png',
            '/modern-lake-house-kitchen.png'
          ]
        }
      ],
      content_blocks: [
        {
          id: 'hero',
          title: 'Welcome to Your Family Lake House',
          content: 'Experience the perfect blend of luxury and nature in our stunning lakefront property. Book your next family getaway today.',
          position: 1,
          type: 'hero'
        },
        {
          id: 'highlights',
          title: 'What Makes Us Special',
          content: 'Easy booking, prime location, and family-friendly amenities make us the perfect choice for your lake house vacation.',
          position: 2,
          type: 'highlights'
        }
      ],
              blackout_dates: [
          {
            id: 'holiday-1',
            listing_id: 'default',
            start_date: new Date('2024-12-24'),
            end_date: new Date('2024-12-26'),
            reason: 'Christmas Holiday',
            type: 'holiday'
          }
        ],
        profiles: [
          {
            id: 'default-user',
            user_id: 'default', // This will be replaced with actual Firebase user ID
            full_name: 'Default User',
            email: 'user@example.com',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        site_settings: [
          {
            id: 'general',
            site_name: 'Made By Foshee',
            site_description: 'Family Lake House Booking Platform',
            contact_email: 'contact@madebyfoshee.com',
            booking_enabled: true,
            maintenance_mode: false,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
    }

    // Initialize listings
    console.log('📋 Creating listings...')
    for (const listing of sampleData.listings) {
      const { id, ...data } = listing
      await adminDb.collection('listings').doc(id).set({
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
      console.log(`✅ Created listing: ${listing.name}`)
    }

    // Initialize content blocks
    console.log('📝 Creating content blocks...')
    for (const block of sampleData.content_blocks) {
      const { id, ...data } = block
      await adminDb.collection('content_blocks').doc(id).set({
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
      console.log(`✅ Created content block: ${block.title}`)
    }

    // Initialize blackout dates
    console.log('🚫 Creating blackout dates...')
    for (const blackout of sampleData.blackout_dates) {
      const { id, ...data } = blackout
      await adminDb.collection('blackout_dates').doc(id).set({
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
      console.log(`✅ Created blackout date: ${blackout.reason}`)
    }

    // Initialize profiles
    console.log('👥 Creating profiles...')
    for (const profile of sampleData.profiles) {
      const { id, ...data } = profile
      await adminDb.collection('profiles').doc(id).set({
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
      console.log(`✅ Created profile: ${profile.full_name}`)
    }

    // Initialize site settings
    console.log('⚙️ Creating site settings...')
    for (const setting of sampleData.site_settings) {
      const { id, ...data } = setting
      await adminDb.collection('site_settings').doc(id).set({
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
      console.log(`✅ Created site setting: ${setting.id}`)
    }

    console.log('🎉 Firestore initialization completed successfully!')
    console.log('You can now view your data in the Firebase Console > Firestore Database')

  } catch (error) {
    console.error('❌ Error initializing Firestore:', error)
    throw error
  }
}

// Get all content blocks (admin)
export async function getContentBlocksAdmin(): Promise<ContentBlock[]> {
  try {
    const querySnapshot = await adminDb.collection('content_blocks')
      .orderBy('position', 'asc')
      .get()
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      content: doc.data().content || '',
      position: doc.data().position || 0,
      type: doc.data().type || ''
    }))
  } catch (error) {
    console.error('Error fetching content blocks:', error)
    return []
  }
}

// Get all listings (admin)
export async function getListingsAdmin(): Promise<Listing[]> {
  try {
    const querySnapshot = await adminDb.collection('listings')
      .orderBy('name', 'asc')
      .get()
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      description: doc.data().description || '',
      max_guests: doc.data().max_guests || 0,
      min_nights: doc.data().min_nights || 0,
      price_per_night: doc.data().price_per_night || 0
    }))
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

// Clear all data (admin)
export async function clearAllData() {
  try {
    console.log('🗑️ Clearing all Firestore data...')
    
    const collections = ['listings', 'content_blocks', 'blackout_dates', 'bookings']
    
    for (const collectionName of collections) {
      const querySnapshot = await adminDb.collection(collectionName).get()
      const batch = adminDb.batch()
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      console.log(`✅ Cleared ${collectionName} collection`)
    }
    
    console.log('🎉 All data cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  }
}
