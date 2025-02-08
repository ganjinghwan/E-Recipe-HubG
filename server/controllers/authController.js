import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail, sendUpdateConfirmationEmail } from "../nodemailer/emailService.js";
import { verifyEmailSMTP } from "../nodemailer/emailVerify.js";
import { Cook } from "../models/Cook.js";
import { Guest } from "../models/Guest.js";
import { EventOrganizer } from "../models/EventOrganizer.js";
import { Moderator } from "../models/moderator.js";
import Recipe from "../models/Recipe.js";
import cloudinary from "../cloudinary/cloudinary.js";

import dayjs from "dayjs";
import DailyLogins from "../models/DailyLogins.js"; // A new Mongoose model
import { Event } from "../models/Event.js";
import { v4 as uuidv4 } from 'uuid';

export const addMessageToInbox = async (req, res) => {
  try {
    const { userId, senderRole, senderName, messageTitle, messageContent, additionalInformation } = req.body;

    if (!userId || !senderRole || !senderName || !messageTitle || !messageContent) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Create the inbox message object
    const newMessage = {
      senderRole,
      senderName,
      messageTitle,
      messageContent,
      date: new Date(),
      readStatus: false,
      additionalInformation
    };

    console.log("New message:", newMessage);

    // Add the new message to the user's inbox
    user.inbox.unshift(newMessage); // Adds to the beginning of the array for latest-first order

    await user.save();

    console.log("User inbox:", user.inbox);

    res.status(200).json({ success: true, message: "Inbox message added successfully.", user });
  } catch (error) {
    console.error("Error adding message to inbox:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const setInboxReadStatus = async (req, res) => {
    try {
        // Find the user
        const user = await User.findById(req.user._id);

        const { messageIndex } = req.body; 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Sort inbox messages by date (latest first)
        const sortedInbox = user.inbox.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Find the index num inside of the inbox array and set the read status to true
        sortedInbox[messageIndex].readStatus = true;

        await user.save();

        res.status(200).json({ success: true, inbox: sortedInbox });
    } catch (error) {
        console.error("Error fetching user inbox:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user inbox" });
    }
};

export const checkUserAcceptInviteStatus = async (req, res) => {
    try {
        const {specificEventURL} = req.params;

        const user = await User.findById(req.user._id);

        const AvailableEvent = await Event.findOne({ eventSpecificEndUrl: specificEventURL });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!AvailableEvent) {
            return res.status(200).json({ 
                success: true, 
                eventExpired: true,
                message: "Event has expired or has deleted" 
            });
        }

        const alreadyJoin = AvailableEvent.attendees.includes(user._id);

        // console.log("Already Join :", alreadyJoin);
        return res.status(200).json({ success: true, alreadyJoined: alreadyJoin });
    } catch (error) {
        // console.error("Error fetching event status:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user inbox" });
    }
};

export const checkUserRejectInviteStatus = async (req, res) => {
    try {
        const {specificEventURL} = req.params;

        const user = await User.findById(req.user._id);

        const AvailableEvent = await Event.findOne({ eventSpecificEndUrl: specificEventURL });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!AvailableEvent) {
            return res.status(200).json({ 
                success: true,
                eventExpired: true, 
                message: "Event has expired or has deleted"
            });
        }

        const alreadyReject = AvailableEvent.rejected.includes(user._id);

        console.log("Already Join :", alreadyReject);
        return res.status(200).json({ success: true, alreadyRejected: alreadyReject });
    } catch (error) {
        console.error("Error fetching event status:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user inbox" });
    } 
};

export const getUserInbox = async (req, res) => {
    try {
        // Find the user and only return the 'inbox' field
        const user = await User.findById(req.user._id).select("inbox");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Sort inbox messages by date (latest first)
        const sortedInbox = user.inbox.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ success: true, inbox: sortedInbox });
    } catch (error) {
        console.error("Error fetching user inbox:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user inbox" });
    }
};


export const getUserList_CGE = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ["cook", "guest", "event-organizer"] } });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error- fetching users" });
    }
}

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

        if (unverifiedUser) {
            return res.status(400).json({ success: false, message: ["Looks like your email is not been verified, please register again 15 minutes later"]});
        }

        if (userAlreadyExists) {
            SignUpErrors.push("Email has already registered");
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
    
        if (user.role === "guest") {
            user.isRoleInfoCreated = true;

            const guestInfo = new Guest({
                guest_id: user._id,
                favouriteRecipes: [],
            })

            await user.save();

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
        user.loginCount = (user.loginCount || 0) + 1; // Increment loginCount
        await user.save();

        // Increment daily login count
        const today = dayjs().format("YYYY-MM-DD");
        const allowedRoles = ["guest", "cook", "event-organizer"];
        if (allowedRoles.includes(user.role)) {
            const dailyLog = await DailyLogins.findOne({ date: today });

            if (dailyLog) {
                // Check if userID already exists in today's login record
                if (!dailyLog.userID.includes(user._id)) {
                    dailyLog.userID.push(user._id); // Add userID
                    dailyLog.loginCount += 1; // Increment login count
                    await dailyLog.save();
                }
            } else {
                // Create a new record for today's date if it doesn't exist
                await DailyLogins.create({
                    userID: [user._id], // Add userID
                    date: today,
                    loginCount: 1, // Set login count to 1
                });
            }
        }

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

        const resetToken = uuidv4();
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hours

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // Determine base URL
        const baseUrl = req.protocol + '://' + req.get('host');
        const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

        //send reset password email
        await sendResetPasswordEmail(user.email, resetUrl);

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

export const uploadProfilePicture = async (req, res) => {
    try {
       const {profilePicture} = req.body;

       const userID = req.user._id;

       if (!userID) {
        return res.status(400).json({ success: false, message: "User not found" });
       }

       if (!profilePicture) {
        return res.status(400).json({ success: false, message: "Please upload a profile picture" });
       }

       const uploadResponse = await cloudinary.uploader.upload(profilePicture);

       const updatedUser = await User.findByIdAndUpdate(userID, {
           profilePicture: uploadResponse.secure_url
       }, { new: true });

       res.status(200).json({
           success: true,
           message: "Profile picture uploaded successfully",
           user: updatedUser
       })
    } catch (error) {
        console.log("Error uploading profile picture", error.message);
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

export const deleteIncompleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ success: true, message: 'Incomplete User deleted successfully' });
    } catch (error) {
        console.log("Failed to delete incomplete user:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
    
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'moderator') {
            await Moderator.findOneAndDelete({ moderator_id: user._id });
            await User.findByIdAndDelete(req.user._id);
        } else if (user.role === 'event-organizer') {
            await Event.deleteMany({ eventBelongs_id: user._id });
            await EventOrganizer.findOneAndDelete({ event_org_id: user._id });
            await User.findByIdAndDelete(req.user._id);
        } else if (user.role === 'guest') {
            await Guest.findOneAndDelete({ guest_id: user._id });
            await User.findByIdAndDelete(req.user._id);
        } else if (user.role === 'cook') {
            await Recipe.deleteMany({ user_id: user._id });
            await Cook.findOneAndDelete({ cook_id: user._id });
            await User.findByIdAndDelete(req.user._id);
        } else {
            res.status(400).json({ success: false, message: 'User role not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log("Fail to delete user:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getDailyLogins = async (req, res) => {
    try {
        const last7Days = [...Array(7).keys()].map((i) =>
            dayjs().subtract(i, "day").format("YYYY-MM-DD")
        );

        const logins = await DailyLogins.find({ date: { $in: last7Days } });

        // Ensure all days are represented, even with 0 counts
        const result = last7Days.map((date) => {
            const record = logins.find((login) => login.date === date);
            return { date, loginCount: record ? record.loginCount : 0 }; // Default count is 0
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

  