import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // In a real implementation, you would:
    // 1. Send email via your email service (SendGrid, Resend, etc.)
    // 2. Store in database for tracking
    // 3. Send notification to Discord
    
    console.log('Support request received:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      timestamp: new Date().toISOString()
    })
    
    // For now, just log the request and return success
    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully. We\'ll get back to you within 2 business hours.',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error processing support request:', error)
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Support API endpoint available',
    endpoints: {
      submit: 'POST /api/support',
      hours: '24/7 email, 9 AM - 6 PM chat (GMT+8)'
    }
  })
}