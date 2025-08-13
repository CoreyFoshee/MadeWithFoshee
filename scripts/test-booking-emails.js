const { Resend } = require('resend')

// Load environment variables
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY)

async function testBookingEmails() {
  try {
    console.log('🧪 Testing booking email functionality...')
    
    // Test 1: User confirmation email
    console.log('\n📧 Testing user confirmation email...')
    const userConfirmationResult = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: 'corey@cfdesign.studio',
      subject: 'Booking Request Confirmed - Family Lake House',
      html: `
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
              <h2>Hello Corey Foshee!</h2>
              
              <p>Thank you for your booking request for <strong>Family Lake House</strong>. We've received your request and it's currently under review.</p>
              
              <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Property:</strong> Family Lake House</p>
                <p><strong>Check-in:</strong> 2025-01-15</p>
                <p><strong>Check-out:</strong> 2025-01-18</p>
                <p><strong>Guests:</strong> 4</p>
                <p><strong>Notes:</strong> Weekend getaway with family</p>
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
      `,
      text: `
Booking Request Confirmed - Family Lake House

Hello Corey Foshee!

Thank you for your booking request for Family Lake House. We've received your request and it's currently under review.

Booking Details:
- Property: Family Lake House
- Check-in: 2025-01-15
- Check-out: 2025-01-18
- Guests: 4
- Notes: Weekend getaway with family
- Status: Pending Review

What happens next?
- Your request has been sent to the property owner for approval
- You'll receive an email notification once your request is approved or denied
- Please note that all booking requests require owner approval

If you have any questions about your booking request, please contact the property owner.

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
      `
    })
    
    console.log('✅ User confirmation email sent successfully!')
    console.log('Message ID:', userConfirmationResult.data?.id)
    
    // Test 2: Admin notification email
    console.log('\n📧 Testing admin notification email...')
    const adminNotificationResult = await resend.emails.send({
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: 'corey@cfdesign.studio',
      subject: 'New Booking Request - Family Lake House',
      html: `
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
              <h2>Hello Property Owner!</h2>
              
              <p>You have a new booking request for <strong>Family Lake House</strong> that requires your approval.</p>
              
              <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Guest:</strong> Corey Foshee</p>
                <p><strong>Property:</strong> Family Lake House</p>
                <p><strong>Check-in:</strong> 2025-01-15</p>
                <p><strong>Check-out:</strong> 2025-01-18</p>
                <p><strong>Guests:</strong> 4</p>
                <p><strong>Notes:</strong> Weekend getaway with family</p>
                <p><strong>Booking ID:</strong> test-booking-123</p>
              </div>
              
              <div class="action-buttons">
                <a href="http://localhost:3000/api/admin/approve-booking?bookingId=test-booking-123&token=test-token" class="btn btn-approve">✓ Approve Booking</a>
                <a href="http://localhost:3000/api/admin/deny-booking?bookingId=test-booking-123&token=test-token" class="btn btn-deny">✗ Deny Booking</a>
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
      `,
      text: `
New Booking Request - Family Lake House

Hello Property Owner!

You have a new booking request for Family Lake House that requires your approval.

Booking Details:
- Guest: Corey Foshee
- Property: Family Lake House
- Check-in: 2025-01-15
- Check-out: 2025-01-18
- Guests: 4
- Notes: Weekend getaway with family
- Booking ID: test-booking-123

To approve this booking: http://localhost:3000/api/admin/approve-booking?bookingId=test-booking-123&token=test-token
To deny this booking: http://localhost:3000/api/admin/deny-booking?bookingId=test-booking-123&token=test-token

Note: Clicking these links will immediately approve or deny the booking request. The guest will be automatically notified of your decision.

Lake With Foshee - Family Lake House
This is an automated message, please do not reply directly to this email.
      `
    })
    
    console.log('✅ Admin notification email sent successfully!')
    console.log('Message ID:', adminNotificationResult.data?.id)
    
    console.log('\n🎉 All email tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing emails:', error)
  }
}

testBookingEmails()
