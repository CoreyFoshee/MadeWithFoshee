const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin
const serviceAccount = require('../lake-booking-site-firebase-adminsdk-fbsvc-d126c3038f.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});

const db = getFirestore();

async function initializeProductionData() {
  console.log('🚀 Initializing production database...');

  try {
    // Sample listing data
    const listingData = {
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
    };

    // Sample content blocks
    const contentBlocks = [
      {
        id: 'hero-section',
        title: 'Welcome to Our Lake House',
        content: 'Experience the perfect blend of luxury and nature at our beautiful lakefront property.',
        type: 'hero',
        order: 1
      },
      {
        id: 'about-section',
        title: 'About Our Property',
        content: 'Nestled on the shores of a pristine lake, our house offers breathtaking views and modern amenities.',
        type: 'content',
        order: 2
      }
    ];

    // Sample site settings
    const siteSettings = {
      id: 'main-settings',
              site_name: 'Lake With Foshee',
      contact_email: 'booking@lakewithfoshee.com',
      phone: '+1 (555) 123-4567',
      address: '123 Lake View Drive, Lake Tahoe, CA 96150'
    };

    // Write data to Firestore
    console.log('📝 Writing listing data...');
    await db.collection('listings').doc(listingData.id).set(listingData);

    console.log('📝 Writing content blocks...');
    for (const block of contentBlocks) {
      await db.collection('content_blocks').doc(block.id).set(block);
    }

    console.log('📝 Writing site settings...');
    await db.collection('site_settings').doc(siteSettings.id).set(siteSettings);

    console.log('✅ Production database initialized successfully!');
    console.log('🌐 Your site should now work with real data!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Run the initialization
initializeProductionData();
