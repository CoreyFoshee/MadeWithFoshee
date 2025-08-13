import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface InviteEmailData {
  to: string
  fullName: string
  inviteUrl: string
  inviterName: string
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
