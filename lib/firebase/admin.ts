import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Check if we're in development and have the service account key
let serviceAccount: any = null

try {
  // In development, you can place the service account JSON in the project root
  // and import it here, or use environment variables
  if (process.env.NODE_ENV === 'development') {
    // You can either:
    // 1. Place the service account JSON in the project root and import it
    // 2. Use environment variables (recommended for production)
    
    // Option 1: Direct import (place your service account JSON in the project root)
    serviceAccount = require('../../lake-booking-site-firebase-adminsdk-fbsvc-d126c3038f.json')
    
    // Option 2: Environment variables (recommended for production)
    // serviceAccount = {
    //   type: process.env.FIREBASE_ADMIN_TYPE,
    //   project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    //   private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    //   private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    //   client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    //   client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    //   auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    //   token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    //   auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    //   client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    // }
  }
} catch (error) {
  console.log('Service account not found, using default credentials')
}

// Initialize Firebase Admin
const app = getApps().length === 0 
  ? initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
  : getApps()[0]

// Get Firestore instance
export const adminDb = getFirestore(app)

export default app
