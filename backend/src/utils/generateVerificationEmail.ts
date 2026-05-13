const generateVerificationEmail = (fullName: string, verificationCode: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #333; margin-bottom: 20px;">Welcome to Social Media!</h1>
        <p style="color: #666; font-size: 16px;">Hi ${fullName},</p>
        <p style="color: #666; font-size: 16px;">Thank you for signing up. Your verification code is:</p>
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; font-size: 24px; margin: 0;">${verificationCode}</h2>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
      </div>
    </div>
  `
}

export default generateVerificationEmail
