import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_EMAIL_TEMPLATE, UPDATE_PROFILE_CONFIRMATION_TEMPLATE } from "./emailTemplate.js";
import transporter from "./nodemailer.config.js";

  export const sendVerificationEmail = async (email, verificationToken) => {
    try {
      const response = await transporter.sendMail({
        from: {
          name: "E-Recipe-Hub",
          address: "masomaticdev@gmail.com",
        },
        to: email,                              
        subject: "Please verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      });
  
      console.log("Verification email sent successfully", response);
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      if (error.message.includes('5.1.1')) {
        throw new Error("Invalid email address");
      } else {
        throw new Error(`Error sending verification email: ${error.message}`);
      }
    }
  };

  export const sendWelcomeEmail = async (email, name) => {  
    try {
      const response = await transporter.sendMail({
        from: {
          name: "E-Recipe-Hub",
          address: "masomaticdev@gmail.com",
        },
        to: email,
        subject: "Welcome to E-Recipe-Hub!",
        html: WELCOME_EMAIL_TEMPLATE.replace("{username}", name),
      });
  
      console.log("Welcome email sent successfully", response);
    } catch (error) {
      console.error("Error sending welcome email:", error.message);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
  };
  

  export const sendResetPasswordEmail = async (email, resetURL) => {
    try {
      const response = await transporter.sendMail({
        from: {
          name: "E-Recipe-Hub",
          address: "masomaticdev@gmail.com",
        },
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });
  
      console.log("Password reset email sent successfully", response);
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  };

  export const sendResetSuccessEmail = async (email) => {
    try {
      const response = await transporter.sendMail({
        from: {
          name: "E-Recipe-Hub",
          address: "masomaticdev@gmail.com",
        },
        to: email,
        subject: "Password reset successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      });
  
      console.log("Password reset success email sent successfully", response);
    } catch (error) {
      console.error("Error sending password reset success email:", error.message);
      throw new Error(`Error sending password reset success email: ${error.message}`);
    }
  };

  export const sendUpdateConfirmationEmail = async (email, verificationCode) => {
    try {   
      const response = await transporter.sendMail({
        from: {
          name: "E-Recipe-Hub",
          address: "masomaticdev@gmail.com",
        },
        to: email,
        subject: "Please verify for an update",
        html: UPDATE_PROFILE_CONFIRMATION_TEMPLATE.replace("{verificationCode}", verificationCode),
      });

      console.log("Update Confirmation Email sent successfully", response);
    } catch (error) {
        console.error("Error sending update confirmation email", error.message);
        throw new Error(`Error sending update confirmation email: ${error.message}`);
    }
}