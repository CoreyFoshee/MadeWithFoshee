# Made By Foshee - Lake House Booking Site

A modern, responsive vacation rental booking platform built with Next.js 14, Firebase, and Tailwind CSS.

## 🚀 **Current Status: Firebase Migration Complete**

This project has been successfully migrated from Supabase to Firebase for better free tier limits and more reliable authentication.

## ✨ **Features**

- **Modern Authentication**: Firebase Authentication with email/password
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Firebase Firestore for live data
- **Booking Management**: Complete booking system with calendar integration
- **Admin Dashboard**: Property management and content editing
- **Beautiful UI**: Modern, accessible components with Radix UI

## 🛠️ **Tech Stack**

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Package Manager**: pnpm
- **Deployment**: Vercel (recommended)

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd made-by-foshee
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Other Services
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 **Authentication**

The site uses Firebase Authentication with email/password login. Users can:
- Sign up for new accounts
- Sign in with existing credentials
- Access protected routes automatically
- Sign out from the header

## 🏗️ **Project Structure**

```
made-by-foshee/
├── app/                    # Next.js App Router pages
│   ├── auth/             # Authentication pages
│   ├── admin/            # Admin dashboard
│   ├── book/             # Booking form
│   ├── my-trips/         # User bookings
│   └── place/            # Property details
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── admin/            # Admin-specific components
│   └── ...               # Other components
├── lib/                   # Utility libraries
│   ├── firebase/         # Firebase configuration and utilities
│   └── ...               # Other utilities
└── public/                # Static assets
```

## 🎯 **Next Steps for Full Functionality**

1. **Set up Firestore collections**:
   - `profiles` - User profiles and roles
   - `bookings` - Booking records
   - `listings` - Property information
   - `content_blocks` - Dynamic content

2. **Enable Firebase services**:
   - Authentication rules
   - Firestore security rules
   - Storage (for images)

3. **Deploy to production**:
   - Vercel (recommended)
   - Update environment variables
   - Configure custom domain

## 🚀 **Deployment**

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify Firebase configuration** in `.env.local`
3. **Ensure all dependencies** are installed
4. **Check Firebase console** for authentication and database status

## 🔄 **Migration Notes**

- **From Supabase**: This project was migrated from Supabase to Firebase
- **Benefits**: Higher free tier limits, more reliable authentication
- **Database**: Firestore (NoSQL) instead of PostgreSQL
- **Auth**: Firebase Auth instead of Supabase Auth
- **Real-time**: Firestore real-time listeners instead of Supabase subscriptions
