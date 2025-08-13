# Email Notification System

This document describes the comprehensive email notification system for the Lake With Foshee booking platform.

## Overview

The system automatically sends emails at key points in the booking lifecycle:
- **User confirmation** when a booking request is submitted
- **Admin notification** when a new booking requires approval
- **Status updates** when bookings are approved, denied, or cancelled

## Email Types

### 1. User Confirmation Email
**Triggered:** When a user submits a booking request
**Recipient:** The guest who made the booking
**Content:**
- Confirmation that the request was received
- Booking details (dates, guests, property, notes)
- Status: "Pending Review"
- Explanation of next steps

### 2. Admin Notification Email
**Triggered:** When a new booking request is submitted
**Recipient:** Property owner/admin
**Content:**
- Complete booking details
- **Approve/Deny buttons** with direct action links
- Booking ID for reference

### 3. Status Update Emails
**Triggered:** When admin approves, denies, or cancels a booking
**Recipient:** The guest
**Content:**
- Updated booking status
- Booking details
- Next steps based on status

## Email Templates

All emails use responsive HTML templates with:
- Lake With Foshee branding
- Professional styling
- Mobile-friendly design
- Both HTML and plain text versions

## Security

### Admin Approval Links
- Each approval/denial link includes a secure token
- Token is verified before processing the action
- Links expire after use (immediate action)

### Environment Variables Required
```bash
RESEND_API_KEY=your_resend_api_key
ADMIN_APPROVAL_TOKEN=your_secure_token
NEXT_PUBLIC_SITE_URL=your_site_url
```

## API Endpoints

### Approve Booking
```
GET /api/admin/approve-booking?bookingId={id}&token={token}
```

### Deny Booking
```
GET /api/admin/deny-booking?bookingId={id}&token={token}
```

Both endpoints:
- Verify the admin token
- Update the booking status
- Send confirmation email to guest
- Redirect to success page

## Success Page

After email approval/denial, admins are redirected to:
```
/admin/success?status={approved|denied}&bookingId={id}
```

This page confirms the action was completed and provides navigation options.

## Testing

Use the test script to verify email functionality:
```bash
node scripts/test-booking-emails.js
```

This will send test emails to verify:
- Email templates render correctly
- Resend API integration works
- Email content is appropriate

## Email Flow Diagram

```
User submits booking
        ↓
┌─────────────────┐
│ User gets       │
│ confirmation    │
│ email          │
└─────────────────┘
        ↓
┌─────────────────┐
│ Admin gets      │
│ notification    │
│ email with      │
│ approve/deny    │
│ buttons         │
└─────────────────┘
        ↓
Admin clicks button
        ↓
┌─────────────────┐
│ Booking status  │
│ updated         │
└─────────────────┘
        ↓
┌─────────────────┐
│ Guest gets      │
│ status update   │
│ email          │
└─────────────────┘
```

## Configuration

### Resend Setup
1. Create account at [resend.com](https://resend.com)
2. Add your domain (lakewithfoshee.com)
3. Get API key
4. Set `RESEND_API_KEY` environment variable

### Admin Token
Generate a secure random token for admin approval links:
```bash
# Generate a secure token
openssl rand -hex 32
# Set as ADMIN_APPROVAL_TOKEN
```

### Email Addresses
Currently hardcoded to `corey@cfdesign.studio` for admin notifications.
**TODO:** Make this configurable via environment variable or admin settings.

## Error Handling

- Email failures don't prevent booking operations
- All email errors are logged to console
- Graceful fallback if email service is unavailable

## Future Enhancements

- [ ] Configurable admin email addresses
- [ ] Email templates customization
- [ ] Email delivery tracking
- [ ] Retry logic for failed emails
- [ ] Email preferences per user
- [ ] SMS notifications as backup

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check `RESEND_API_KEY` is set
   - Verify domain is verified in Resend
   - Check console for error messages

2. **Admin approval links not working**
   - Verify `ADMIN_APPROVAL_TOKEN` is set
   - Check token matches in email links
   - Ensure `NEXT_PUBLIC_SITE_URL` is correct

3. **Email templates not rendering**
   - Check browser console for errors
   - Verify email service is working
   - Test with the test script

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG_EMAILS=true
```

This will log all email operations to the console.
