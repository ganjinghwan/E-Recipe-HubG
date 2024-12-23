import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail, sendUpdateConfirmationEmail } from "../nodemailer/emailService.js";
import dotenv from "dotenv";
import { verifyEmailSMTP } from "../nodemailer/emailVerify.js";
import { Cook } from "../models/Cook.js";
import { EventOrganizer } from "../models/EventOrganizer.js";
import { Guest } from "../models/Guest.js";

dotenv.config();


export const getAllCook = async (req, res) => {
    try {
        const users = await User.find({role:"cook"});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error- fetching cook name" });
    }
}

export const signup = async (req, res) => {
    const {email, password, name, role} = req.body;

    try {
        if (!email || !password || !name || !role) {
            return res.status(400).json({ message: ['Please fill in all fields'] });
        }

        try {
            const isEmailValid = await verifyEmailSMTP(email);
            if (!isEmailValid) {
                return res.status(400).json({ success: false, message: ["Invalid email address. Please provide a valid email."]});
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: ["Error validating email address. Please try again later."]});
        }

        const SignUpErrors = [];
        
        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        const unverifiedUser = await User.findOne({ email, isVerified: false });

        const repeatedUsername = await User.findOne({ name });
        console.log("repeatedUsername", repeatedUsername);

        if (userAlreadyExists) {
            SignUpErrors.push("Email has already registered");
        }

        if (unverifiedUser) {
            return res.status(400).json({ success: false, message: ["Looks like your email is not been verified, please register again 15 minutes later"]});
        }

        if (repeatedUsername) {
            SignUpErrors.push ("Username already exists");
        }

        if (SignUpErrors.length > 0) {
            return res.status(400).json({ success: false, message: SignUpErrors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        //ensure the verification code is 6 digits long
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); 
        const user = new User({ email, 
                                password: hashedPassword, 
                                name,
                                role,
                                verificationToken,
                                verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000 //15 minutes
                            });

        await user.save();

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
        return res.status(400).json({ success: false, message: [error.message] });
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
    
    
        if (user.role === "cook") {
            const cookInfo = new Cook({
                cook_id: user._id,
                specialty: "",
                experience: "",
                rating: "",
            })

            await cookInfo.save();
        } else if (user.role === "event-organizer") {
            const eventOrganizerInfo = new EventOrganizer({
                event_org_id: user._id,
                organizationName: "",
                organizationDescription: "",
                organizationContact: "",
                organizationLocation: "",
                events_list: [],
            })

            await eventOrganizerInfo.save();
        } else if (user.role === "guest") {
            const guestInfo = new Guest({
                guest_id: user._id,
                favouriteRecipes: [],
            })

            await guestInfo.save();
        }


        //jsonwebtoken
        generateTokenAndSetCookie(res, user._id);

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
        if (!email || !password) {
            return res.status(400).json({ success: false, message: ["Please fill in all fields"]});
        }

        const LoginErrors = [];

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success: false, message: ["Invalid credentials"] });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: ["Email has been registered but has not been verified. Please try again later"]});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            LoginErrors.push("Wrong password, please try again");
        }

        if (LoginErrors.length > 0) {
            return res.status(400).json({ success: false, message: LoginErrors });
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
        res.status(400).json({ success: false, message: [error.message] });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('jwtoken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        try {
            const isEmailValid = await verifyEmailSMTP(email);
            if (!isEmailValid) {
                return res.status(400).json({ success: false, message: "Invalid email address. Please provide a valid email."});
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: "Error validating email address. Please try again later."});
        }

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
        await sendResetPasswordEmail(user.email, `localhost:5173/reset-password/${resetToken}`);

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

export const updateProfile = async (req, res) => {
    const { name, password, phone } = req.body;

    try {
        if (!name && !password && !phone) {
            return res.status(400).json({ message: ['Please fill in any of the fields to update']});
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ message: ['User not found'] });
        }

        const updatedError = [];

        if (name) {
            if (name === user.name) {
                updatedError.push("Same username, please choose a different one");
            } else {
                const usernameRepeat = await User.findOne({ name });
                if (usernameRepeat && usernameRepeat._id.toString() !== user._id.toString()) {
                    updatedError.push("Username already exists");
                } else {
                    user.tempName = name;
                }
            }
        }

        if (password) {
            const passwordRepeat = await bcrypt.compare(password, user.password);
            if (passwordRepeat) {
                updatedError.push("Password is the same as before");
            } else {
                user.tempPassword = await bcrypt.hash(password, 10);
            }
        }

        if (phone) {
            if (phone === user.phoneNumber) {
                updatedError.push("Same phone number, please choose a different one");
            } else {
                const phoneRepeat = await User.findOne({ phoneNumber: phone });
                if (phoneRepeat && phoneRepeat._id.toString() !== user._id.toString()) {
                    updatedError.push("Phone number already exists");
                } else {
                    user.tempPhoneNumber = phone;
                }
            }
        }

        if (updatedError.length > 0) {
            return res.status(400).json({ success: false, message: updatedError });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationCode;
        user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        await user.save();
        await sendUpdateConfirmationEmail(user.email, verificationCode);

        res.status(200).json({
            success: true,
            message: "Profile update requested. Please verify via email.",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: [error.message] });
    }
};


export const verifyUpdate = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        if (user.tempName) {
            user.name = user.tempName;
        }

        if (user.tempPassword) {
            user.password = user.tempPassword;
        }

        if (user.tempPhoneNumber) {
            user.phoneNumber = user.tempPhoneNumber;
        }

        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.tempName = undefined;
        user.tempPassword = undefined;
        user.tempPhoneNumber = undefined;

        await user.save();

        /*if (user.role === "cook") {
            const cookInfo = await Cook.findOne({ cook_id: user._id });

            if (!cookInfo) {
                return res.status(400).json({ success: false, message: 'Cook information not found' });
            }

            if (cookInfo.tempSpecialty) {
                cookInfo.specialty = cookInfo.tempSpecialty;
            }

            if (cookInfo.tempExperience) {
                cookInfo.experience = cookInfo.tempExperience;
            }

            cookInfo.tempSpecialty = undefined;
            cookInfo.tempExperience = undefined;

            await cookInfo.save();
        }*/

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Failed to verify update:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};