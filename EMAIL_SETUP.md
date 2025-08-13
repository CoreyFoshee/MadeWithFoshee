# Email System Setup Guide

This guide will help you set up the email functionality for user invitations using Resend.

## Prerequisites

- A Resend account (free tier available)
- Your domain verified with Resend (for production)

## Step 1: Install Dependencies

The required dependencies have already been installed:
```bash
pnpm add resend
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration (existing)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## Step 3: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the API key to your `.env.local` file

## Step 4: Verify Your Domain (Production)

For production use, you'll need to verify your domain with Resend:

1. In your Resend dashboard, go to Domains
2. Add your domain (e.g., `lakewithfoshee.com`)
3. Follow the DNS verification steps
4. Update the `from` email in `lib/email.ts` to use your verified domain

## Step 5: Test the System

1. Start your development server: `pnpm dev`
2. Go to the admin dashboard
3. Navigate to the Users tab
4. Try sending an invitation to a test email
5. Check the email is received and the invitation link works

## Alternative: Firebase SMTP

If you prefer to use Firebase SMTP instead of Resend:

1. Install the Firebase Admin SDK (already done)
2. Configure Firebase SMTP settings in your Firebase project
3. Update `lib/email.ts` to use Firebase SMTP instead of Resend
4. Update environment variables accordingly

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check your Resend API key and domain verification
2. **Invitation links not working**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
3. **Authentication errors**: Verify Firebase configuration and admin privileges

### Testing

- Use a real email address for testing (not a placeholder)
- Check your spam folder if emails don't arrive
- Verify the invitation token is being generated correctly

## Security Notes

- Invitation tokens expire after 7 days
- Only users with admin/owner roles can send invitations
- Invitations are tied to specific email addresses
- User accounts require password creation during acceptance

## Production Considerations

1. **Rate Limiting**: Implement rate limiting for invitation requests
2. **Email Templates**: Customize email templates for your brand
3. **Monitoring**: Set up email delivery monitoring
4. **Backup**: Consider having a fallback email service
