const generateResetPasswordEmail = (resetPasswordUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #333; margin-bottom: 20px;">Reset Your Password</h1>
        <p style="color: #666; font-size: 16px;">Click the button below to reset your password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetPasswordUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4299e1; 
                            color: white; text-decoration: none; border-radius: 4px; 
                            font-weight: 500;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `
}

export default generateResetPasswordEmail
