import { Resend } from 'resend';
import logger from '../utils/logger.js';

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message, submitTip } = req.body;
    
    // Ensure submitTip is a boolean
    const isTipSubmission = Boolean(submitTip);

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and message' 
      });
    }

    // Email configuration - Always send to asalhimsanda@gmail.com
    const recipientEmail = 'asalhimsanda@gmail.com';
    
    // Get Resend API key from environment
    const resendApiKey = process.env.RESEND_API_KEY;

    // Check if Resend API key is configured
    if (!resendApiKey) {
      logger.error('\n❌ RESEND API KEY NOT CONFIGURED!');
      logger.error('Please add RESEND_API_KEY to your server/.env file');
      logger.error('Get your free API key from: https://resend.com/api-keys');
      logger.error('\n📧 Contact Form Submission (NOT SENT):');
      logger.info('Name:', name);
      logger.info('Email:', email);
      logger.info('Message:', message);
      logger.info('Submit Tip:', isTipSubmission);
      logger.error('==========================================\n');
      
      return res.status(500).json({ 
        message: 'Email service is not configured. Please contact the administrator.',
        success: false 
      });
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Email content
    const subject = isTipSubmission 
      ? `New Tip Submission from ${name} - THE DAY NEWS`
      : `New Contact Form Submission from ${name} - THE DAY NEWS`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New ${isTipSubmission ? 'Tip Submission' : 'Contact Form Submission'}</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${isTipSubmission ? 'Tip Submission' : 'General Inquiry'}</p>
        </div>
        <div style="background: #ffffff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
          <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          This email was sent from THE DAY NEWS website contact form.
        </p>
      </div>
    `;

    // Send email using Resend
    logger.info('\n📧 Sending email to:', recipientEmail);
    logger.info('Subject:', subject);
    
    const { data, error } = await resend.emails.send({
      from: 'THE DAY NEWS <onboarding@resend.dev>', // You can change this after verifying your domain
      to: recipientEmail,
      subject: subject,
      html: emailContent,
      replyTo: email, // Allow replying directly to the sender
    });

    if (error) {
      logger.error('❌ Resend API Error:', error);
      throw error;
    }
    
    logger.info('✅ Email sent successfully!');
    logger.info('Email ID:', data?.id);
    logger.info('==========================================\n');

    res.json({ 
      message: 'Thank you for your message! We have received it and will get back to you soon.',
      success: true 
    });
  } catch (error) {
    logger.error('\n❌ EMAIL SENDING ERROR:');
    logger.error('Error details:', error.message);
    if (error.response) {
      logger.error('API Response:', error.response);
    }
    logger.error('==========================================\n');
    
    // Return error to user so they know something went wrong
    res.status(500).json({ 
      message: 'Failed to send email. Please try again later or contact us directly.',
      success: false 
    });
  }
};

