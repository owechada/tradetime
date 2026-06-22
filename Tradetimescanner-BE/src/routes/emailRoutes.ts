import express from "express";
import { 
  sendPromotionalEmail, 
  sendBulkEmail, 
  previewPromotionalEmail 
} from "../controllers/emailController";
import { triggerSubscriptionExpiryCheck } from "../services/emailScheduler";

const router = express.Router();

/**
 * @route POST /api/emails/promotional
 * @desc Send promotional email to user segments
 * @access Admin only
 */
router.post("/promotional", sendPromotionalEmail);

/**
 * @route POST /api/emails/bulk
 * @desc Send email to specific email addresses
 * @access Admin only
 */
router.post("/bulk", sendBulkEmail);

/**
 * @route POST /api/emails/preview
 * @desc Preview promotional email template
 * @access Admin only
 */
router.post("/preview", previewPromotionalEmail);

/**
 * @route POST /api/emails/test-expiry-check
 * @desc Manually trigger subscription expiry check (for testing)
 * @access Admin only
 */
router.post("/test-expiry-check", async (req, res) => {
  try {
    await triggerSubscriptionExpiryCheck();
    res.status(200).json({ message: "Subscription expiry check triggered successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error triggering expiry check",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
