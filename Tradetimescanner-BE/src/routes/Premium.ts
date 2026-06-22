import { Router } from "express";
import { getUserById, VerifyUser } from "../controllers/UserControllers";
import {
  CancelSubscription,
  CreateCheckout,
  CreateSubscription,
  GetSession,
  GetSubscription,
} from "../controllers/Premiumcontrollers";
import { createCCPaymentCheckout, ccPaymentWebhook } from "../controllers/CCPaymentController";

const router = Router();
router.post("/checkout/", CreateCheckout);
router.post("/subscribe/", CreateSubscription);
router.get("/retrive/:id", GetSubscription);
router.get("/session/:id", GetSession);
router.post("/cancel/:id", CancelSubscription);
// CCPayment routes
router.post("/ccpayment/checkout", createCCPaymentCheckout);
router.post("/ccpayment/webhook", ccPaymentWebhook);

export default router;
