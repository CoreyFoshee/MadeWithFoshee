import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './config'

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Firebase Auth: Starting sign in for:', email)
  console.log('Firebase Auth: Current auth state:', auth.currentUser ? `User: ${auth.currentUser.email}` : 'No user')
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('Firebase Auth: Sign in successful, user:', userCredential.user.email)
    console.log('Firebase Auth: Auth state after sign in:', auth.currentUser ? `User: ${auth.currentUser.email}` : 'No user')
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    console.log('Firebase Auth: Sign in error:', error.message)
    return { user: null, error: error.message }
  }
}

// Create user with email and password
export const createUser = async (email: string, password: string) => {
  console.log('Firebase Auth: Starting user creation for:', email)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log('Firebase Auth: User creation successful:', userCredential.user.email)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    console.log('Firebase Auth: User creation error:', error.message)
    return { user: null, error: error.message }
  }
}

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('Firebase Auth: Setting up auth state listener')
  return onAuthStateChanged(auth, (user) => {
    console.log('Firebase Auth: Auth state changed:', user ? `User: ${user.email}` : 'No user')
    callback(user)
  })
}
