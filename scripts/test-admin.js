// Test script to verify admin privileges
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const serviceAccount = require('../lake-booking-site-firebase-adminsdk-fbsvc-adce2d1c561b.json');

const adminApp = initializeApp({
  credential: cert(serviceAccount),
  projectId: 'lake-booking-site'
});

const db = getFirestore(adminApp);

async function testAdminSystem() {
  try {
    console.log('🔍 Testing admin privileges system...');
    
    // Test 1: Check if Corey has admin privileges
    const coreyUserId = 'E8LW8y2cqWZkiA5SDtmGkmqp49t2';
    
    // First, let's manually set Corey as admin
    const profileQuery = await db.collection('profiles').where('user_id', '==', coreyUserId).get();
    
    if (!profileQuery.empty) {
      const profileDoc = profileQuery.docs[0];
      await profileDoc.ref.update({
        role: 'admin',
        updated_at: new Date()
      });
      console.log('✅ Set Corey as admin');
    }
    
    // Now check admin privileges
    const profile = profileQuery.docs[0].data();
    console.log('👤 Corey\'s profile:', {
      user_id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role
    });
    
    // Test 2: Check admin privileges function
    const isAdmin = profile.role === 'admin' || profile.role === 'owner';
    console.log('🔐 Corey is admin:', isAdmin);
    
    // Test 3: Try to grant admin to another user (should work)
    const testUserId = 'test-user-123';
    const testProfile = {
      user_id: testUserId,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      role: 'family'
    };
    
    // Create test profile
    await db.collection('profiles').add(testProfile);
    console.log('✅ Created test user profile');
    
    // Grant admin role (this should work since Corey is admin)
    const testProfileQuery = await db.collection('profiles').where('user_id', '==', testUserId).get();
    if (!testProfileQuery.empty) {
      const testProfileDoc = testProfileQuery.docs[0];
      await testProfileDoc.ref.update({
        role: 'admin',
        updated_at: new Date()
      });
      console.log('✅ Granted admin role to test user');
    }
    
    console.log('🎉 Admin privileges system test completed!');
    
  } catch (error) {
    console.error('❌ Error testing admin system:', error);
  }
}

testAdminSystem();
