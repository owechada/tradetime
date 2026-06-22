import cron from "node-cron";
import User from "../models/User";
import { SendEmail } from "../controllers/UtilsControllers";
import { getSubscriptionExpiryReminderTemplate } from "./emailTemplates";
import { Op } from "sequelize";

/**
 * Check for subscriptions expiring in 3 days and send reminder emails
 */
const checkSubscriptionExpiry = async () => {
  try {
    console.log("Running subscription expiry check...");

    // Calculate date 3 days from now
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Format date to match the database format (assuming it's stored as string)
    const targetDate = threeDaysFromNow.toISOString().split("T")[0];

    // Find users whose subscription expires in 3 days
    const expiringUsers = await User.findAll({
      where: {
        subExpiryDate: {
          [Op.like]: `${targetDate}%`, // Match date regardless of time
        },
        is_trial: {
          [Op.ne]: "NULL", // Has an active subscription
        },
      },
    });

    console.log(`Found ${expiringUsers.length} subscriptions expiring on ${targetDate}`);

    // Send reminder emails
    for (const user of expiringUsers) {
      try {
        const emailTemplate = getSubscriptionExpiryReminderTemplate(
          user.username,
          user.subExpiryDate,
          user.subscription_id || ""
        );

        await SendEmail({
          subject: emailTemplate.subject,
          to: user.mail,
          from: "Trade Time Scanner",
          body: emailTemplate.html,
        });

        console.log(`Sent expiry reminder to ${user.mail}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${user.mail}:`, emailError);
      }
    }
  } catch (error) {
    console.error("Error in subscription expiry check:", error);
  }
};

/**
 * Initialize the email scheduler
 * Runs daily at 9:00 AM to check for expiring subscriptions
 */
export const initializeEmailScheduler = () => {
  // Schedule to run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Starting scheduled subscription expiry check at", new Date().toISOString());
    await checkSubscriptionExpiry();
  });

  console.log("Email scheduler initialized - will check for expiring subscriptions daily at 9:00 AM");
};

/**
 * Manual trigger for testing purposes
 */
export const triggerSubscriptionExpiryCheck = async () => {
  console.log("Manually triggering subscription expiry check...");
  await checkSubscriptionExpiry();
};
