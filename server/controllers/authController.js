import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(400).json({ success: false,message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(Math.random() * 1000000 + 50000).toString();
        const user = new User({ email, 
                                password: hashedPassword, 
                                name,
                                verificationToken,
                                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
                            });

        await user.save();

        //jsonwebtoken
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({ 
            success: true, 
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch(error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({ 
            verificationToken: code, 
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully',
          user:{
            ...user._doc,
            password: undefined,
          },
        });
    } catch (error) {
        console.log("Failed to verify email", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Wrong password, please try again" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Failed to login", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('jwtoken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(24).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hours

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //send reset password email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
        })
    } catch (error) {
        console.log("Failed to send password reset email", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        //update the password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })

    } catch (error) {
        console.log("Failed to reset password", error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); //select all except password

        if(!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Failed to check auth", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}