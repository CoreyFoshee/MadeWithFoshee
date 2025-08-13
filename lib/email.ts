import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface InviteEmailData {
  to: string
  fullName: string
  inviteUrl: string
  inviterName: string
}

export interface BookingEmailData {
  to: string
  guestName: string
  listingName: string
  startDate: string
  endDate: string
  guests: number
  notes?: string
  bookingId: string
}

export interface AdminNotificationData {
  to: string
  adminName: string
  guestName: string
  listingName: string
  startDate: string
  endDate: string
  guests: number
  notes?: string
  bookingId: string
  approveUrl: string
  denyUrl: string
}

export interface BookingStatusEmailData {
  to: string
  guestName: string
  listingName: string
  startDate: string
  endDate: string
  guests: number
  status: 'approved' | 'denied' | 'cancelled'
  notes?: string
  adminNotes?: string
}

export async function sendInviteEmail(data: InviteEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: data.to,
      subject: `You're invited to Lake With Foshee - Lake House Access`,
      html: generateInviteEmailHTML(data),
      text: generateInviteEmailText(data),
    })

    if (error) {
      console.error('Error sending invite email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: result?.id }
  } catch (error) {
    console.error('Error in sendInviteEmail:', error)
    throw error
  }
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: data.to,
      subject: `Booking Request Confirmed - ${data.listingName}`,
      html: generateBookingConfirmationHTML(data),
      text: generateBookingConfirmationText(data),
    })

    if (error) {
      console.error('Error sending booking confirmation email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: result?.id }
  } catch (error) {
    console.error('Error in sendBookingConfirmationEmail:', error)
    throw error
  }
}

export async function sendAdminNotificationEmail(data: AdminNotificationData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: data.to,
      subject: `New Booking Request - ${data.listingName}`,
      html: generateAdminNotificationHTML(data),
      text: generateAdminNotificationText(data),
    })

    if (error) {
      console.error('Error sending admin notification email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: result?.id }
  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error)
    throw error
  }
}

export async function sendBookingStatusEmail(data: BookingStatusEmailData) {
  try {
    const statusText = data.status === 'approved' ? 'Approved' : data.status === 'denied' ? 'Not Available' : 'Cancelled'
    const { data: result, error } = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: data.to,
      subject: `Booking ${statusText} - ${data.listingName}`,
      html: generateBookingStatusHTML(data),
      text: generateBookingStatusText(data),
    })

    if (error) {
      console.error('Error sending booking status email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: result?.id }
  } catch (error) {
    console.error('Error in sendBookingStatusEmail:', error)
    throw error
  }
}

function generateInviteEmailHTML(data: InviteEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited to Lake With Foshee</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; }
        .content { padding: 30px 0; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #007bff;">Lake With Foshee</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Lake House Access Invitation</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.fullName}!</h2>
          
          <p>You've been invited by <strong>${data.inviterName}</strong> to join Lake With Foshee and get access to our beautiful lake house.</p>
          
          <p>As a family member, you'll be able to:</p>
          <ul>
            <li>View lake house availability and photos</li>
            <li>Submit booking requests for your preferred dates</li>
            <li>Manage your upcoming trips</li>
            <li>Stay connected with the family</li>
          </ul>
          
          <p><strong>Important:</strong> All booking requests require owner approval to ensure fair access for everyone.</p>
          
          <div style="text-align: center;">
            <a href="${data.inviteUrl}" class="button">Accept Invitation & Set Up Account</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This invitation link will expire in 7 days. If you have any questions, please contact the property owner.
          </p>
        </div>
        
        <div class="footer">
          <p>Lake With Foshee - Family Lake House</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateInviteEmailText(data: InviteEmailData): string {
  return `
You're Invited to Lake With Foshee - Lake House Access

Hello ${data.fullName}!

You've been invited by ${data.inviterName} to join Lake With Foshee and get access to our beautiful lake house.

As a family member, you'll be able to:
- View lake house availability and photos
- Submit booking requests for your preferred dates
- Manage your upcoming trips
- Stay connected with the family

Important: All booking requests require owner approval to ensure fair access for everyone.

Accept your invitation here: ${data.inviteUrl}

This invitation link will expire in 7 days. If you have any questions, please contact the property owner.

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
  `
}

function generateBookingConfirmationHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Request Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; }
        .content { padding: 30px 0; }
        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #1f7a7e;">Lake With Foshee</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Booking Request Confirmed</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.guestName}!</h2>
          
          <p>Thank you for your booking request for <strong>${data.listingName}</strong>. We've received your request and it's currently under review.</p>
          
          <div class="booking-details">
            <h3>Booking Details:</h3>
            <p><strong>Property:</strong> ${data.listingName}</p>
            <p><strong>Check-in:</strong> ${data.startDate}</p>
            <p><strong>Check-out:</strong> ${data.endDate}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
            <p><strong>Status:</strong> <span style="color: #e79a3c; font-weight: bold;">Pending Review</span></p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Your request has been sent to the property owner for approval</li>
            <li>You'll receive an email notification once your request is approved or denied</li>
            <li>Please note that all booking requests require owner approval</li>
          </ul>
          
          <p>If you have any questions about your booking request, please contact the property owner.</p>
        </div>
        
        <div class="footer">
          <p>Lake With Foshee - Family Lake House</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateBookingConfirmationText(data: BookingEmailData): string {
  return `
Booking Request Confirmed - ${data.listingName}

Hello ${data.guestName}!

Thank you for your booking request for ${data.listingName}. We've received your request and it's currently under review.

Booking Details:
- Property: ${data.listingName}
- Check-in: ${data.startDate}
- Check-out: ${data.endDate}
- Guests: ${data.guests}
${data.notes ? `- Notes: ${data.notes}` : ''}
- Status: Pending Review

What happens next?
- Your request has been sent to the property owner for approval
- You'll receive an email notification once your request is approved or denied
- Please note that all booking requests require owner approval

If you have any questions about your booking request, please contact the property owner.

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
  `
}

function generateAdminNotificationHTML(data: AdminNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; }
        .content { padding: 30px 0; }
        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; font-weight: bold; }
        .btn-approve { background: #28a745; color: white; }
        .btn-deny { background: #dc3545; color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #1f7a7e;">Lake With Foshee</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">New Booking Request</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.adminName}!</h2>
          
          <p>You have a new booking request for <strong>${data.listingName}</strong> that requires your approval.</p>
          
          <div class="booking-details">
            <h3>Booking Details:</h3>
            <p><strong>Guest:</strong> ${data.guestName}</p>
            <p><strong>Property:</strong> ${data.listingName}</p>
            <p><strong>Check-in:</strong> ${data.startDate}</p>
            <p><strong>Check-out:</strong> ${data.endDate}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
          </div>
          
          <div class="action-buttons">
            <a href="${data.approveUrl}" class="btn btn-approve">✓ Approve Booking</a>
            <a href="${data.denyUrl}" class="btn btn-deny">✗ Deny Booking</a>
          </div>
          
          <p><strong>Note:</strong> Clicking these links will immediately approve or deny the booking request. The guest will be automatically notified of your decision.</p>
        </div>
        
        <div class="footer">
          <p>Lake With Foshee - Family Lake House</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateAdminNotificationText(data: AdminNotificationData): string {
  return `
New Booking Request - ${data.listingName}

Hello ${data.adminName}!

You have a new booking request for ${data.listingName} that requires your approval.

Booking Details:
- Guest: ${data.guestName}
- Property: ${data.listingName}
- Check-in: ${data.startDate}
- Check-out: ${data.endDate}
- Guests: ${data.guests}
${data.notes ? `- Notes: ${data.notes}` : ''}
- Booking ID: ${data.bookingId}

To approve this booking: ${data.approveUrl}
To deny this booking: ${data.denyUrl}

Note: Clicking these links will immediately approve or deny the booking request. The guest will be automatically notified of your decision.

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
  `
}

function generateBookingStatusHTML(data: BookingStatusEmailData): string {
  const statusColor = data.status === 'approved' ? '#28a745' : data.status === 'denied' ? '#dc3545' : '#6c757d'
  const statusText = data.status === 'approved' ? 'Approved' : data.status === 'denied' ? 'Not Available' : 'Cancelled'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking ${statusText}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; }
        .content { padding: 30px 0; }
        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #1f7a7e;">Lake With Foshee</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Booking ${statusText}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.guestName}!</h2>
          
          <p>Your booking request for <strong>${data.listingName}</strong> has been <span class="status-badge" style="background: ${statusColor};">${statusText}</span>.</p>
          
          <div class="booking-details">
            <h3>Booking Details:</h3>
            <p><strong>Property:</strong> ${data.listingName}</p>
            <p><strong>Check-in:</strong> ${data.startDate}</p>
            <p><strong>Check-out:</strong> ${data.endDate}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            ${data.notes ? `<p><strong>Your Notes:</strong> ${data.notes}</p>` : ''}
            ${data.adminNotes ? `<p><strong>Admin Notes:</strong> ${data.adminNotes}</p>` : ''}
          </div>
          
          ${data.status === 'approved' ? `
          <p><strong>🎉 Your booking is confirmed!</strong></p>
          <p>Please make sure to:</p>
          <ul>
            <li>Mark your calendar for these dates</li>
            <li>Plan your arrival and departure times</li>
            <li>Contact the property owner if you have any questions</li>
          </ul>
          ` : data.status === 'denied' ? `
          <p><strong>We're sorry, but your requested dates are not available.</strong></p>
          <p>This could be due to:</p>
          <ul>
            <li>Another family member has already booked these dates</li>
            <li>The property is unavailable during this period</li>
            <li>Maintenance or other restrictions</li>
          </ul>
          <p>Please try selecting different dates for your stay.</p>
          ` : `
          <p><strong>Your booking has been cancelled.</strong></p>
          <p>If you have any questions about this cancellation, please contact the property owner.</p>
          `}
        </div>
        
        <div class="footer">
          <p>Lake With Foshee - Family Lake House</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateBookingStatusText(data: BookingStatusEmailData): string {
  const statusText = data.status === 'approved' ? 'Approved' : data.status === 'denied' ? 'Not Available' : 'Cancelled'
  
  return `
Booking ${statusText} - ${data.listingName}

Hello ${data.guestName}!

Your booking request for ${data.listingName} has been ${statusText}.

Booking Details:
- Property: ${data.listingName}
- Check-in: ${data.startDate}
- Check-out: ${data.endDate}
- Guests: ${data.guests}
${data.notes ? `- Your Notes: ${data.notes}` : ''}
${data.adminNotes ? `- Admin Notes: ${data.adminNotes}` : ''}

${data.status === 'approved' ? `
🎉 Your booking is confirmed!

Please make sure to:
- Mark your calendar for these dates
- Plan your arrival and departure times
- Contact the property owner if you have any questions
` : data.status === 'denied' ? `
We're sorry, but your requested dates are not available.

This could be due to:
- Another family member has already booked these dates
- The property is unavailable during this period
- Maintenance or other restrictions

Please try selecting different dates for your stay.
` : `
Your booking has been cancelled.

If you have any questions about this cancellation, please contact the property owner.
`}

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
  `
}
