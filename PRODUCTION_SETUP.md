# 🚀 Production Setup Guide

## Getting Your Booking System Fully Functional

### 1. 🔑 Set Up Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `LakeWithFoshee` project
3. Go to **Settings → Environment Variables**
4. Add these variables (get values from your Firebase Console):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. 🔐 Configure Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database → Rules**
4. Set this temporarily for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ Only for testing!
    }
  }
}
```

### 3. 🗄️ Initialize Your Database

1. **Install dotenv** (if not already installed):
   ```bash
   pnpm add dotenv
   ```

2. **Run the initialization script**:
   ```bash
   node scripts/init-production.js
   ```

3. **Verify data** in Firebase Console → Firestore

### 4. 🔄 Redeploy to Vercel

After setting environment variables, redeploy:
```bash
git add .
git commit -m "Add production setup scripts"
git push
```

### 5. 🧪 Test Your Booking System

1. Visit your Vercel URL
2. Navigate to the property page
3. Select dates on the calendar
4. Submit a booking request
5. Check Firebase Console for new bookings

## 🎯 What This Will Fix

- ✅ **Calendar functionality** (already working)
- ✅ **Date selection** (already working)
- ✅ **Booking submission** (will work after setup)
- ✅ **Data persistence** (will work after setup)
- ✅ **Family access** (will work after setup)

## 🚨 Important Notes

- **Security Rules**: The current rules allow anyone to read/write. For production, implement proper authentication rules.
- **Service Account**: Keep your `lake-booking-site-firebase-adminsdk-*.json` file secure and never commit it to git.
- **Environment Variables**: These are public (NEXT_PUBLIC_*) but your service account key is private.

## 🆘 If You Get Stuck

1. Check **Vercel deployment logs** for errors
2. Check **Firebase Console** for database issues
3. Check **browser console** for client-side errors
4. Verify **environment variables** are set correctly

## 🎉 After Setup

Your family will be able to:
- Browse your property
- Select dates on the calendar
- Submit booking requests
- View their bookings
- Access admin features (if you set them up)

---

**Need help?** Check the Firebase Console logs and Vercel deployment status for specific error messages.
