import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import transporter from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
      await transporter.sendMail({
        from: '"E-Recipe-Hub" <your_gmail@gmail.com>', // Your Gmail address
        to: email,                                    // Recipient email
        subject: "Please verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      });
  
      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      throw new Error(`Error sending verification email: ${error.message}`);
    }
  };

  export const sendWelcomeEmail = async (email, name) => {
    const htmlContent = `
      <p>Hello ${name},</p>
      <p>Welcome to E-Recipe-Hub! We're glad to have you onboard.</p>
      <p>Best regards,</p>
      <p>The E-Recipe-Hub Team</p>
    `;
  
    try {
      await transporter.sendMail({
        from: '"E-Recipe-Hub" <your_gmail@gmail.com>',
        to: email,
        subject: "Welcome to E-Recipe-Hub!",
        html: htmlContent,
      });
  
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Error sending welcome email:", error.message);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
  };
  

  export const sendResetPasswordEmail = async (email, resetURL) => {
    try {
      await transporter.sendMail({
        from: '"E-Recipe-Hub" <your_gmail@gmail.com>',
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });
  
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  };

  export const sendResetSuccessEmail = async (email) => {
    try {
      await transporter.sendMail({
        from: '"E-Recipe-Hub" <your_gmail@gmail.com>',
        to: email,
        subject: "Password reset successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      });
  
      console.log("Password reset success email sent successfully");
    } catch (error) {
      console.error("Error sending password reset success email:", error.message);
      throw new Error(`Error sending password reset success email: ${error.message}`);
    }
  };