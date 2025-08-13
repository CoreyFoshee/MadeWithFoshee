#!/usr/bin/env node

/**
 * Test script for the email system
 * Run with: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' })

const { Resend } = require('resend')

async function testEmail() {
  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local')
    console.log('Please add your Resend API key to .env.local')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    console.log('🧪 Testing email system...')
    
    // Test email data
    const testData = {
      from: 'Lake With Foshee <noreply@app.lakewithfoshee.com>',
      to: 'corey@cfdesign.studio', // Your verified email for testing
      subject: 'Test Email from Lake With Foshee',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the email system is working.</p>
        <p>If you receive this, the email configuration is correct!</p>
        <hr>
        <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
      `,
      text: `
Test Email from Lake With Foshee

This is a test email to verify the email system is working.

If you receive this, the email configuration is correct!

Sent at: ${new Date().toLocaleString()}
      `
    }

    console.log('📧 Sending test email...')
    
    const { data, error } = await resend.emails.send(testData)

    if (error) {
      console.error('❌ Error sending email:', error)
      return
    }

    console.log('✅ Test email sent successfully!')
    console.log('📨 Message ID:', data?.id)
    console.log('📧 Check your email inbox (and spam folder)')
    
  } catch (error) {
    console.error('❌ Error in test:', error)
  }
}

// Run the test
testEmail()
