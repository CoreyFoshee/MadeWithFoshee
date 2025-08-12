// Script to initialize Firestore database with sample data
// Run this with: node scripts/init-firestore.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Your Firebase config (copy from .env.local)
const firebaseConfig = {
  apiKey: "AIzaSyDAs3ODYgL23iM2NKcjwKozns2XUlxweWM",
  authDomain: "lake-booking-site.firebaseapp.com",
  projectId: "lake-booking-site",
  storageBucket: "lake-booking-site.firebasestorage.app",
  messagingSenderId: "822183431927",
  appId: "1:822183431927:web:e3d312fc3fe01932da8df2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  ]
};

async function initializeFirestore() {
  try {
    console.log('🚀 Starting Firestore initialization...');

    // Initialize listings
    console.log('📋 Creating listings...');
    for (const listing of sampleData.listings) {
      const { id, ...data } = listing;
      await setDoc(doc(db, 'listings', id), {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log(`✅ Created listing: ${listing.name}`);
    }

    // Initialize content blocks
    console.log('📝 Creating content blocks...');
    for (const block of sampleData.content_blocks) {
      const { id, ...data } = block;
      await setDoc(doc(db, 'content_blocks', id), {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log(`✅ Created content block: ${block.title}`);
    }

    // Initialize blackout dates
    console.log('🚫 Creating blackout dates...');
    for (const blackout of sampleData.blackout_dates) {
      const { id, ...data } = blackout;
      await setDoc(doc(db, 'blackout_dates', id), {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log(`✅ Created blackout date: ${blackout.reason}`);
    }

    console.log('🎉 Firestore initialization completed successfully!');
    console.log('You can now view your data in the Firebase Console > Firestore Database');

  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
  }
}

// Run the initialization
initializeFirestore();

