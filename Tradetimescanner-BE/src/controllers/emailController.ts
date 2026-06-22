import { Request, Response } from "express";
import User from "../models/User";
import { SendEmail } from "./UtilsControllers";
import { getPromotionalEmailTemplate } from "../services/emailTemplates";
import { Op } from "sequelize";

/**
 * Send promotional email to all users or specific segments
 * Admin only endpoint
 */
export const sendPromotionalEmail = async (req: Request, res: Response) => {
  try {
    const { subject, content, ctaText, ctaLink, segment } = req.body;

    // Validate required fields
    if (!subject || !content) {
      res.status(400).json({ message: "Subject and content are required" });
      return;
    }

    // Build query based on segment
    let whereClause: any = {};
    const today = new Date().toISOString().split("T")[0];

    switch (segment) {
      case "active_subscribers":
        // Users with active subscriptions (not expired)
        whereClause = {
          subExpiryDate: {
            [Op.gte]: today,
          },
          is_trial: {
            [Op.ne]: "NULL",
          },
        };
        break;
      case "trial_users":
        // Users on trial
        whereClause = {
          is_trial: "1",
        };
        break;
      case "expired_subscribers":
        // Users whose subscription has expired
        whereClause = {
          subExpiryDate: {
            [Op.lt]: today,
          },
          is_sub_before: "1",
        };
        break;
      case "all":
      default:
        // All users
        whereClause = {};
        break;
    }

    // Get users based on segment
    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "username", "mail"],
    });

    if (users.length === 0) {
      res.status(404).json({ message: "No users found for the selected segment" });
      return;
    }

    // Generate email template
    const emailTemplate = getPromotionalEmailTemplate(subject, content, ctaText, ctaLink);

    // Send emails to all users in the segment
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        await SendEmail({
          subject: emailTemplate.subject,
          to: user.mail,
          from: "Trade Time Scanner",
          body: emailTemplate.html,
        });
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${user.mail}:`, emailError);
        failCount++;
      }
    }

    res.status(200).json({
      message: "Promotional email campaign completed",
      totalUsers: users.length,
      successCount,
      failCount,
      segment: segment || "all",
    });
  } catch (error) {
    console.error("Error sending promotional email:", error);
    res.status(500).json({
      message: "Error sending promotional email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Send promotional email to specific users by email addresses
 * Admin only endpoint
 */
export const sendBulkEmail = async (req: Request, res: Response) => {
  try {
    const { subject, content, ctaText, ctaLink, emails } = req.body;

    // Validate required fields
    if (!subject || !content || !emails || !Array.isArray(emails)) {
      res.status(400).json({
        message: "Subject, content, and emails array are required",
      });
      return;
    }

    if (emails.length === 0) {
      res.status(400).json({ message: "Emails array cannot be empty" });
      return;
    }

    // Generate email template
    const emailTemplate = getPromotionalEmailTemplate(subject, content, ctaText, ctaLink);

    // Send emails to specified addresses
    let successCount = 0;
    let failCount = 0;
    const failedEmails: string[] = [];

    for (const email of emails) {
      try {
        await SendEmail({
          subject: emailTemplate.subject,
          to: email,
          from: "Trade Time Scanner",
          body: emailTemplate.html,
        });
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
        failCount++;
        failedEmails.push(email);
      }
    }

    res.status(200).json({
      message: "Bulk email campaign completed",
      totalEmails: emails.length,
      successCount,
      failCount,
      failedEmails,
    });
  } catch (error) {
    console.error("Error sending bulk email:", error);
    res.status(500).json({
      message: "Error sending bulk email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Preview promotional email template
 * Returns the HTML that would be sent
 */
export const previewPromotionalEmail = async (req: Request, res: Response) => {
  try {
    const { subject, content, ctaText, ctaLink } = req.body;

    if (!subject || !content) {
      res.status(400).json({ message: "Subject and content are required" });
      return;
    }

    const emailTemplate = getPromotionalEmailTemplate(subject, content, ctaText, ctaLink);

    res.status(200).json({
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
  } catch (error) {
    console.error("Error previewing email:", error);
    res.status(500).json({
      message: "Error previewing email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
