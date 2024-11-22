import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Please verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending verification email", error.message);

        throw new Error(`Error sending verification email: ${error.message}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({ 
            from: sender,
            to: recipient,
            template_uuid: "7feece7b-c076-486c-ae4a-6c8780358b33",
            template_variables: {
                "name": name,
                "company_info_name": "E-Recipe-Hub"
            },
        });

        console.log("Welcome email sent successfully", response);

    } catch (error) {
        console.error("Error sending verification email", error.message);

        throw new Error(`Error sending verification email: ${error.message}`);
    }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });
    } catch (error) {
        console.error("Error sending password reset email", error.message);

        throw new Error(`Error sending password reset email: ${error.message}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset success email", error.message);

        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
}