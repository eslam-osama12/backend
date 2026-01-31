const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'E-commerce'} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    throw error; // Re-throw to let controller handle it
  }
};

// Email templates
const emailTemplates = {
  // Email verification template
  emailVerification: (name, code) => ({
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background-color: #fff; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to E-commerce!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <p>Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    message: `Hi ${name},\n\nThank you for signing up! Your email verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
  }),

  // Password reset template
  passwordReset: (name, code) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .code { font-size: 32px; font-weight: bold; color: #FF5722; text-align: center; padding: 20px; background-color: #fff; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>You requested to reset your password. Use the code below to proceed:</p>
            <div class="code">${code}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
            </div>
          </div>
          <div class="footer">
            <p>© 2024 E-commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    message: `Hi ${name},\n\nYou requested to reset your password. Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
  }),
};

module.exports = { sendEmail, emailTemplates };
