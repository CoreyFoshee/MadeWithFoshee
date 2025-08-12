# Made by Foshee - Lake House Booking Site

A beautiful, modern lake house booking platform built with Next.js, Firebase, and Tailwind CSS.

## 🚀 **Latest Updates - Firebase Integration Complete!**
- ✅ **Full Firebase migration** from Supabase
- ✅ **Working booking system** with admin approval workflow
- ✅ **Real-time status updates** for bookings
- ✅ **Admin dashboard** for managing bookings and blackout dates
- ✅ **Responsive calendar** with date range selection
- ✅ **All runtime errors resolved** and components working

## Features

- **Property Listings**: Beautiful property showcase with image galleries
- **Smart Calendar**: Interactive date picker with availability checking
- **Booking System**: Complete workflow from request to confirmation
- **Admin Dashboard**: Manage bookings, blackout dates, and content
- **User Authentication**: Secure login and user management
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoreyFoshee/MadeWithFoshee.git
   cd MadeWithFoshee
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Firebase configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

The site is automatically deployed to Vercel on every push to the main branch.

**Live Site**: [https://made-with-foshee.vercel.app](https://made-with-foshee.vercel.app)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── book/              # Booking form
│   ├── my-trips/          # User's bookings
│   └── place/             # Property showcase
├── components/             # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── ui/                # Base UI components
│   └── ...                # Other components
├── lib/                    # Utility libraries
│   ├── firebase/          # Firebase configuration
│   └── ...                # Other utilities
└── public/                 # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary to Made by Foshee.

---

**Built with ❤️ by Corey Foshee**
