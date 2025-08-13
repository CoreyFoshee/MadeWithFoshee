// Simple script to add a user profile
// Run this with: node scripts/add-profile.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (you'll need to set your service account path)
const serviceAccount = require('../lake-booking-site-firebase-adminsdk-fbsvc-adce2d1c561b.json');

const adminApp = initializeApp({
  credential: cert(serviceAccount),
  projectId: 'lake-booking-site'
});

const db = getFirestore(adminApp);

async function addProfile() {
  try {
    // Add profile for corey@onehopechurch.com
    const profileData = {
      user_id: 'corey-user', // You can change this to the actual Firebase UID
      first_name: 'Corey',
      last_name: 'Foshee',
      email: 'corey@onehopechurch.com',
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await db.collection('profiles').add(profileData);
    console.log('✅ Profile created successfully with ID:', docRef.id);
    console.log('Profile data:', profileData);
    
  } catch (error) {
    console.error('❌ Error creating profile:', error);
  }
}

addProfile();
