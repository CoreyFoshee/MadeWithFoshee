import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let adminApp: App | null = null
let adminDbInstance: Firestore | null = null

function initializeAdmin() {
  if (adminApp) return adminApp

  // Check if we're in production (Vercel) or development
  if (process.env.NODE_ENV === 'production') {
    // Production: Use environment variables for service account
    const serviceAccount = {
      type: process.env.FIREBASE_ADMIN_TYPE || 'service_account',
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    }

    // Verify we have the essential credentials
    if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
      throw new Error('Missing required Firebase Admin environment variables for production')
    }

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
  } else {
    // Development: Try to use service account file
    let serviceAccount: any = null

    try {
      serviceAccount = require('../../lake-booking-site-firebase-adminsdk-fbsvc-d126c3038f.json')
    } catch (error) {
      console.log('Service account file not found, using default credentials')
    }

    adminApp = initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
  }

  return adminApp
}

// Get Firestore instance (lazy initialization)
export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    const app = initializeAdmin()
    adminDbInstance = getFirestore(app)
  }
  return adminDbInstance
}

// Get Admin App (lazy initialization)
export function getAdminApp(): App {
  return initializeAdmin()
}

export default { getAdminApp, getAdminDb }
