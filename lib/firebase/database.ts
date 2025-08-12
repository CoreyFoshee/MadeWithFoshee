import { db } from './config'
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore'

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

// Get all content blocks
export async function getContentBlocks(): Promise<ContentBlock[]> {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'content_blocks'), orderBy('position', 'asc'))
    )
    
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

// Get all listings
export async function getListings(filters?: any): Promise<Listing[]> {
  try {
    let q = query(collection(db, 'listings'), orderBy('name', 'asc'))
    
    // Apply filters if provided
    if (filters?.search) {
      // Note: Firestore doesn't support full-text search like Supabase
      // You might want to implement Algolia or similar for better search
      q = query(q, where('name', '>=', filters.search), where('name', '<=', filters.search + '\uf8ff'))
    }
    
    if (filters?.maxGuests) {
      q = query(q, where('max_guests', '>=', filters.maxGuests))
    }
    
    if (filters?.minNights) {
      q = query(q, where('min_nights', '>=', filters.minNights))
    }
    
    const querySnapshot = await getDocs(q)
    
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

// Get a single listing by ID
export async function getListing(id: string): Promise<Listing | null> {
  try {
    const docRef = doc(db, 'listings', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        max_guests: data.max_guests || 0,
        min_nights: data.min_nights || 0,
        price_per_night: data.price_per_night || 0
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

// Get bookings for a user
export async function getBookings(userId?: string) {
  try {
    let q = query(collection(db, 'bookings'), orderBy('start_date', 'desc'))
    
    if (userId) {
      q = query(q, where('user_id', '==', userId))
    }
    
    const querySnapshot = await getDocs(q)
    
    // Fetch related data for each booking
    const bookingsWithDetails = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const bookingData = docSnapshot.data()
        
        // Get listing details
        let listingDetails = null
        if (bookingData.listing_id) {
          try {
            const listingDoc = await getDoc(doc(db, 'listings', bookingData.listing_id))
            if (listingDoc.exists()) {
              const listingData = listingDoc.data()
              listingDetails = {
                name: listingData?.name || 'Unknown Property',
                description: listingData?.description || ''
              }
            }
          } catch (error) {
            console.error('Error fetching listing details:', error)
          }
        }
        
        // Get user profile details (placeholder for now)
        const profileDetails = {
          full_name: 'Local User', // For local development
          email: 'user@local.dev'
        }
        
        return {
          id: docSnapshot.id,
          ...bookingData,
          listings: listingDetails || { name: 'Unknown Property', description: '' },
          profiles: profileDetails
        }
      })
    )
    
    return bookingsWithDetails
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

// Get blackout dates
export async function getBlackoutDates() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'blackout_dates'), orderBy('start_date', 'asc'))
    )
    
    // Fetch related listing data for each blackout
    const blackoutsWithDetails = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const blackoutData = docSnapshot.data()
        
        // Get listing details
        let listingDetails = null
        if (blackoutData.listing_id) {
          try {
            const listingDoc = await getDoc(doc(db, 'listings', blackoutData.listing_id))
            if (listingDoc.exists()) {
              const listingData = listingDoc.data()
              listingDetails = {
                name: listingData?.name || 'Unknown Property'
              }
            }
          } catch (error) {
            console.error('Error fetching listing details for blackout:', error)
          }
        }
        
        return {
          id: docSnapshot.id,
          ...blackoutData,
          listings: listingDetails || { name: 'Unknown Property' }
        }
      })
    )
    
    return blackoutsWithDetails
  } catch (error) {
    console.error('Error fetching blackout dates:', error)
    return []
  }
}

// Create a new booking
export async function createBooking(bookingData: any) {
  try {
    console.log('Creating booking with data:', bookingData)
    
    // Convert dates to Firestore Timestamps
    const data = {
      ...bookingData,
      start_date: Timestamp.fromDate(new Date(bookingData.start_date)),
      end_date: Timestamp.fromDate(new Date(bookingData.end_date)),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    }
    
    console.log('Processed booking data:', data)
    
    const docRef = await addDoc(collection(db, 'bookings'), data)
    const result = { id: docRef.id, ...data }
    
    console.log('Booking created successfully:', result)
    return result
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// Update a booking
export async function updateBooking(id: string, updates: any) {
  try {
    const docRef = doc(db, 'bookings', id)
    await updateDoc(docRef, updates)
    return { success: true }
  } catch (error) {
    console.error('Error updating booking:', error)
    throw error
  }
}

// Delete a booking
export async function deleteBooking(id: string) {
  try {
    const docRef = doc(db, 'bookings', id)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    throw error
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'profiles'), where('user_id', '==', userId))
    )
    
    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Get site settings
export async function getSiteSettings() {
  try {
    const querySnapshot = await getDocs(collection(db, 'site_settings'))
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return []
  }
}
