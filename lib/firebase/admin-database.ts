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

// Sample booking for reference
const sampleBooking = {
  id: 'sample-booking-001',
  listing_id: 'lake-house-001',
  user_id: 'sample-user',
  start_date: new Date('2024-12-01'),
  end_date: new Date('2024-12-03'),
  guests: 4,
  notes: 'Sample booking for testing',
  status: 'pending',
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

    // Initialize sample booking
    await adminDb.collection('bookings').doc(sampleBooking.id).set(sampleBooking)
    console.log(`✅ Added sample booking: ${sampleBooking.id}`)

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

    // Clear bookings
    const bookingsSnapshot = await adminDb.collection('bookings').get()
    for (const doc of bookingsSnapshot.docs) {
      await doc.ref.delete()
    }
    console.log('✅ Cleared bookings')

    console.log('🎉 All data cleared successfully!')
    return { success: true, message: 'All data cleared' }
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    return { success: false, error: error.message }
  }
}

// Create or update user profile
export async function createOrUpdateUserProfile(userId: string, profileData: {
  first_name: string
  last_name: string
  email: string
  role?: string
}) {
  try {
    const adminDb = getAdminDb()
    
    // Check if profile already exists
    const profileQuery = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    if (!profileQuery.empty) {
      // Update existing profile
      const profileDoc = profileQuery.docs[0]
      const existingData = profileDoc.data()
      
      // Handle migration from old format to new format
      const updateData: any = {
        ...profileData,
        updated_at: new Date()
      }
      
      // If updating from old format, remove old fields
      if (existingData.full_name) {
        updateData.full_name = adminDb.FieldValue.delete()
        if (existingData.role && !profileData.role) {
          updateData.role = adminDb.FieldValue.delete()
        }
      }
      
      await adminDb.collection('profiles').doc(profileDoc.id).update(updateData)
      console.log(`✅ Updated profile for user: ${userId}`)
      return { success: true, message: 'Profile updated successfully' }
    } else {
      // Create new profile
      const newProfileData: any = {
        user_id: userId,
        ...profileData,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      // Set default role if not specified
      if (!newProfileData.role) {
        newProfileData.role = 'family'
      }
      
      await adminDb.collection('profiles').add(newProfileData)
      console.log(`✅ Created profile for user: ${userId}`)
      return { success: true, message: 'Profile created successfully' }
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    throw error
  }
}

export async function checkAdminPrivileges(userId: string): Promise<boolean> {
  try {
    const adminDb = getAdminDb()
    
    // Check if user has admin role in profiles collection
    const profileQuery = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    if (!profileQuery.empty) {
      const profile = profileQuery.docs[0].data()
      return profile.role === 'admin' || profile.role === 'owner'
    }
    
    return false
  } catch (error) {
    console.error('Error checking admin privileges:', error)
    return false
  }
}

export async function grantAdminRole(userId: string, adminUserId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminDb = getAdminDb()
    
    // First, verify the requesting user is an admin
    const isAdmin = await checkAdminPrivileges(adminUserId)
    if (!isAdmin) {
      return { success: false, message: 'Permission denied: Only admins can grant admin roles' }
    }
    
    // Update the user's profile to include admin role
    const profileQuery = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    if (profileQuery.empty) {
      return { success: false, message: 'User profile not found' }
    }
    
    const profileDoc = profileQuery.docs[0]
    await profileDoc.ref.update({
      role: 'admin',
      updated_at: new Date()
    })
    
    return { success: true, message: 'Admin role granted successfully' }
  } catch (error) {
    console.error('Error granting admin role:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

export async function revokeAdminRole(userId: string, adminUserId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminDb = getAdminDb()
    
    // First, verify the requesting user is an admin
    const isAdmin = await checkAdminPrivileges(adminUserId)
    if (!isAdmin) {
      return { success: false, message: 'Permission denied: Only admins can revoke admin roles' }
    }
    
    // Update the user's profile to remove admin role
    const profileQuery = await adminDb.collection('profiles').where('user_id', '==', userId).get()
    
    if (profileQuery.empty) {
      return { success: false, message: 'User profile not found' }
    }
    
    const profileDoc = profileQuery.docs[0]
    await profileDoc.ref.update({
      role: 'family', // Default to family role
      updated_at: new Date()
    })
    
    return { success: true, message: 'Admin role revoked successfully' }
  } catch (error) {
    console.error('Error revoking admin role:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}
