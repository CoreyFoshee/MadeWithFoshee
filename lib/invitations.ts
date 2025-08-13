import { getAdminDb } from './firebase/admin'
import { sendInviteEmail, InviteEmailData } from './email'

export interface Invitation {
  id: string
  email: string
  fullName: string
  token: string
  inviterId: string
  inviterName: string
  status: 'pending' | 'accepted' | 'expired'
  expiresAt: Date
  createdAt: Date
}

export async function createInvitation(
  email: string, 
  fullName: string, 
  inviterId: string, 
  inviterName: string
): Promise<{ success: boolean; invitation?: Invitation; error?: string }> {
  try {
    const adminDb = getAdminDb()
    
    // Check if invitation already exists for this email
    const existingInvite = await adminDb.collection('invitations')
      .where('email', '==', email)
      .where('status', '==', 'pending')
      .get()
    
    if (!existingInvite.empty) {
      return { success: false, error: 'An invitation has already been sent to this email address' }
    }
    
    // Generate unique token
    const token = generateInviteToken()
    
    // Set expiration (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    
    // Create invitation document
    const invitationData: Omit<Invitation, 'id'> = {
      email,
      fullName,
      token,
      inviterId,
      inviterName,
      status: 'pending',
      expiresAt,
      createdAt: new Date()
    }
    
    const docRef = await adminDb.collection('invitations').add(invitationData)
    
    const invitation: Invitation = {
      id: docRef.id,
      ...invitationData
    }
    
    // Send invitation email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const inviteUrl = `${siteUrl}/auth/accept-invite?token=${token}`
    
    console.log('Sending invitation email to:', email)
    console.log('Invite URL:', inviteUrl)
    console.log('Site URL from env:', process.env.NEXT_PUBLIC_SITE_URL)
    console.log('Using site URL:', siteUrl)
    
    try {
      await sendInviteEmail({
        to: email,
        fullName,
        inviteUrl,
        inviterName
      })
      console.log('Email sent successfully!')
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the invitation creation if email fails
      // The invitation is still created in the database
    }
    
    return { success: true, invitation }
  } catch (error) {
    console.error('Error creating invitation:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create invitation' }
  }
}

export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  try {
    const adminDb = getAdminDb()
    
    const query = await adminDb.collection('invitations')
      .where('token', '==', token)
      .where('status', '==', 'pending')
      .get()
    
    if (query.empty) {
      return null
    }
    
    const doc = query.docs[0]
    const data = doc.data()
    
    // Check if expired
    if (data.expiresAt.toDate() < new Date()) {
      // Mark as expired
      await doc.ref.update({ status: 'expired' })
      return null
    }
    
    return {
      id: doc.id,
      ...data
    } as Invitation
  } catch (error) {
    console.error('Error getting invitation by token:', error)
    return null
  }
}

export async function acceptInvitation(token: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminDb = getAdminDb()
    
    // Get invitation
    const invitation = await getInvitationByToken(token)
    if (!invitation) {
      return { success: false, error: 'Invalid or expired invitation' }
    }
    
    // Create user profile
    await adminDb.collection('profiles').add({
      user_id: userId,
      full_name: invitation.fullName,
      email: invitation.email,
      role: 'family',
      invited_by: invitation.inviterId,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    // Mark invitation as accepted
    await adminDb.collection('invitations').doc(invitation.id).update({
      status: 'accepted',
      accepted_at: new Date(),
      accepted_by: userId
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error accepting invitation:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to accept invitation' }
  }
}

export async function getPendingInvitations(): Promise<Invitation[]> {
  try {
    const adminDb = getAdminDb()
    
    // Simplified query to avoid index requirements
    const query = await adminDb.collection('invitations')
      .where('status', '==', 'pending')
      .get()
    
    // Sort in memory instead of in the query
    const invitations = query.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        fullName: data.fullName,
        token: data.token,
        inviterId: data.inviterId,
        inviterName: data.inviterName,
        status: data.status,
        expiresAt: data.expiresAt?.toDate?.() || data.expiresAt,
        createdAt: data.createdAt?.toDate?.() || data.createdAt
      }
    }) as Invitation[]
    
    // Sort by creation date descending
    return invitations.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error getting pending invitations:', error)
    return []
  }
}

export async function cancelInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminDb = getAdminDb()
    
    await adminDb.collection('invitations').doc(invitationId).delete()
    
    return { success: true }
  } catch (error) {
    console.error('Error canceling invitation:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel invitation' }
  }
}

function generateInviteToken(): string {
  // Generate a secure random token
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
