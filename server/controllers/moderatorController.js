import mongoose from 'mongoose';

import { User } from '../models/User.js';
import Recipe from "../models/Recipe.js";
import { Report } from '../models/Report.js';
import { Event } from '../models/Event.js';
import { EventOrganizer } from '../models/EventOrganizer.js';
import { Guest } from '../models/Guest.js';
import { Cook } from '../models/Cook.js';
import { Moderator } from '../models/moderator.js';

export const newModeratorInformation = async (req, res) => {
    const { moderatorKey } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: ["User not found"] });
        }

        if (!moderatorKey) {
            return res.status(400).json({ success: false, message: ["Moderator keys are required"] });
        }

        if (moderatorKey !== process.env.MODERATOR_KEY) {
            return res.status(401).json({ success: false, message: ["Invalid moderator key"] });
        }

        user.isRoleInfoCreated = true;

        const moderator = new Moderator({
            moderator_id: user._id,
            userlist: [],
        });

        await user.save();

        await moderator.save();

        res.status(200).json({ success: true, message: ["Moderator information created successfully"] });
    } catch (error) {
        console.log("Failed to create moderator", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const addDeletedRecipeHistory = async (req, res) => {
    const { userName, userRole, recipeTitle, recipeId, reason, date} = req.body;
    
    if (!userName ||!userRole || !recipeTitle || !recipeId || !reason) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
      // Fetch the moderator
      const moderator = await Moderator.findOne({ moderator_id: req.user._id });
      if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
      }
  
      // Add to deletedRecipes history
      moderator.deletedRecipes.push({
        userName: userName,
        userRole: userRole,
        recipeTitle: recipeTitle,
        recipeID: recipeId,
        reason: reason,
        date: date,
      });
  
      await moderator.save();
  
      res.status(200).json({ success: true, message: "Recipe deletion recorded in history." });
    } catch (error) {
      console.error("Failed to record deleted recipe:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const getDeletedRecipeHistory = async (req, res) => {
    try {
        const moderator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!moderator) {
            return res.status(404).json({ success: false, message: "Moderator not found" });
        }
        res.status(200).json({ success: true, data: moderator.deletedRecipes });
    } catch (error) {
        console.error("Failed to fetch deleted recipe history:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteImproperUser = async (req, res) => {
    // console.log("deleteImproperUser-id", req.params);
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ success: false, message: 'Invalid User ID' });
        }

        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'event-organizer') {
            await Event.deleteMany({ eventBelongs_id: user._id });
            await EventOrganizer.findOneAndDelete({ event_org_id: user._id });
        } else if (user.role === 'guest') {
            await Guest.findOneAndDelete({ guest_id: user._id });
            
        } else if (user.role === 'cook') {
            await Recipe.deleteMany({ user_id: user._id });
            await Cook.findOneAndDelete({ cook_id: user._id });
        } else {
            res.status(400).json({ success: false, message: 'User role not found' });
        }

        await User.findByIdAndDelete(id);
        await Report.deleteMany({ reporter_id: user._id });
        await Report.deleteMany({ reportedUserId: user._id });


        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log("Fail to delete user:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
  
export const addDeletedUserHistory = async (req, res) => {
    const { userID, userName, userRole, reason, date } = req.body;
  
    if (!userName || !userRole || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
  
    try {
      // Fetch the moderator
      const moderator = await Moderator.findOne({ moderator_id: req.user._id });
      if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
      }
  
      // Add to deletedUsers history
      moderator.deletedUsers.push({
        userID: userID,
        userName: userName,
        userRole: userRole,
        reason: reason,
        date: date,  
      });
  
      await moderator.save();
  
      res.status(200).json({ success: true, message: "User deletion recorded in history." });
    } catch (error) {
      console.error("Failed to record deleted user:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };


export const getDeletedUserHistory = async (req, res) => {
    try {
        const moderator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!moderator) {
            return res.status(404).json({ success: false, message: "Moderator not found" });
        }
        res.status(200).json({ success: true, data: moderator.deletedUsers });
    } catch (error) {
        console.error("Failed to fetch deleted user history:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ success: false, message: 'Invalid Event ID' });
        }

        await Event.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.log("Fail to delete event:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addDeletedEventHistory = async (req, res) => {
    const { eventID, eventTitle, userName, userRole, reason, eventStartDate, eventEndDate, date } = req.body;
  
    if (!eventTitle || !userName || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
  
    try {
      // Fetch the moderator
      const moderator = await Moderator.findOne({ moderator_id: req.user._id });
      if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
      }
  
      // Add to deletedEvents history
      moderator.deletedEvents.push({
        userName: userName,
        userRole: userRole,
        eventID: eventID,
        eventTitle: eventTitle,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        reason: reason,
        date: date,  
      });
  
      await moderator.save();
  
      res.status(200).json({ success: true, message: "Event deletion recorded in history." });
    } catch (error) {
      console.error("Failed to record deleted event:", error.message);      
      res.status(500).json({ success: false, message: error.message });
    }
  };


export const getDeletedEventHistory = async (req, res) => {
    try {
        const moderator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!moderator) {
            return res.status(404).json({ success: false, message: "Moderator not found" });
        }
        res.status(200).json({ success: true, data: moderator.deletedEvents });
    } catch (error) {
        console.error("Failed to fetch deleted event history:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};      


export const addPassedReport = async (req, res) => {
    const { reporterName, reporterRole, reportTitle, reportReason, reportedRecipe,
        reportedUserName, reportedUserRole, date
     } = req.body;
  
    if (!reporterName || !reportedUserName || !reportTitle) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
  
    try {
      // Fetch the moderator
      const moderator = await Moderator.findOne({ moderator_id: req.user._id });
      if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
      }
  
      // Add to deletedReports history
      moderator.passedReports.push({
        reporterName: reporterName,
        reporterRole: reporterRole,
        reportTitle: reportTitle,
        reportReason: reportReason,
        reportedRecipe: reportedRecipe,
        reportedUserName: reportedUserName,
        reportedUserRole: reportedUserRole,
        date: date,  
      });
  
      await moderator.save();
  
      res.status(200).json({ success: true, message: "Report deletion recorded in history." });
    } catch (error) {
      console.error("Failed to record deleted report:", error.message);      
      res.status(500).json({ success: false, message: error.message });
    }
  };


export const getReportHistory = async (req, res) => {
    try {
        const moderator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!moderator) {
            return res.status(404).json({ success: false, message: "Moderator not found" });        
        }
        res.status(200).json({ success: true, data: moderator.passedReports });        
    } catch (error) {
        console.error("Failed to fetch passed report history:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addWarning = async (req, res) => {
    const { warnedUserID, warnedUserName, warnedUserRole, warnedReason, date } = req.body;
  
    if (!warnedUserID || !warnedUserName || !warnedReason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
  
    try {
      const moderators = await Moderator.find();
  
      let warningUpdated = false;
      let currentWarningCount = 0;
  
      // Iterate through all moderators and check for the warned user
      for (const moderator of moderators) {
        const existingWarning = moderator.warnings.find(
          (warning) => warning.warnedUserID.toString() === warnedUserID
        );
  
        if (existingWarning) {
          existingWarning.warningCount += 1; // Increment the warning count
          currentWarningCount = existingWarning.warningCount;
  
          // Append the new reason to the existing reasons
          const label = `Warning Reason ${currentWarningCount}: `;
          existingWarning.warnedReason += `\n${label}${warnedReason}`;
  
          warningUpdated = true;
          await moderator.save(); // Save the updated warning
          break;
        }
      }
  
      // If the user has no existing warning, add a new warning
      if (!warningUpdated) {
        const currentModerator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!currentModerator) {
          return res.status(404).json({ success: false, message: "Moderator not found" });
        }
  
        const initialLabel = "Warning Reason 1: ";
        currentModerator.warnings.push({
          warnedUserID,
          warnedUserName,
          warnedUserRole,
          warnedReason: `${initialLabel}${warnedReason}`,
          warningCount: 1,
          date,
        });
        currentWarningCount = 1;
        await currentModerator.save();
      }
  
      // If the warning count exceeds the threshold, return a special response
      const WARNING_THRESHOLD = 3; // Adjust as needed
      if (currentWarningCount > WARNING_THRESHOLD) {
        return res.status(200).json({
          success: true,
          warningThresholdExceeded: true,
          message: `User ${warnedUserName} has exceeded the warning threshold with ${currentWarningCount} warnings.`,
        });
      }
  
      res.status(200).json({
        success: true,
        warningThresholdExceeded: false,
        currentWarningCount,
        warnedUserID,
        moderatorName: req.user.name,
        message: "Warning recorded successfully.",
      });
    } catch (error) {
      console.error("Failed to record warning:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

  export const getWarningHistory = async (req, res) => {
    try {
      const moderators = await Moderator.find();
  
      const allWarnings = moderators.reduce((acc, moderator) => {
        return acc.concat(moderator.warnings);
      }, []);
  
      res.status(200).json({ success: true, data: allWarnings });
    } catch (error) {
      console.error("Failed to fetch warning history:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

 