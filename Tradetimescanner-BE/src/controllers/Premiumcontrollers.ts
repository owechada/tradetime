import { Request, Response } from "express";
import { SavedScans } from "../models/SavedScans";
import User from "../models/User";
import Stripe from "stripe";
async function CreateCheckout(req: Request, res: Response): Promise<void> {
  var body = req.body;
  var lineitems = body.products.map((product: any) => ({
    price_data: {
      currency: "usd",
      product_data: { name: `${product.name} + ${product.plan}` },
      unit_amount: product.plan.includes("monthly") ? 1500 : 14400,
    },
    quantity: 1,
  }));
  const stripe = new Stripe(process.env.STRIPE_SK_Test || "");

  var session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineitems,
    payment_method_types: ["card"],
    success_url: `${process.env.productionURL}premiumsuccess`,
    cancel_url: `${process.env.productionURL}premiumcanceled`,
  });
  res.json({ sessionId: session.id });
}

async function CreateSubscription(req: Request, res: Response): Promise<void> {
  const stripe = new Stripe(process.env.STRIPE_SK_Test || "");
  try {
    const { name, email, paymentMethod, products } = req.body;
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });

    // Create a product
    const product = await stripe.products.create({
      name: "Monthly subscription",
    });

    // Create a subscription

    const monthlyprice_data: Stripe.SubscriptionCreateParams.Item.PriceData = {
      currency: "USD",
      product: product.id,
      unit_amount: 1500,
      recurring: {
        interval: "month",
      },
    };

    const yearlyprice_data: Stripe.SubscriptionCreateParams.Item.PriceData = {
      currency: "USD",
      product: product.id,
      unit_amount: 13200,
      recurring: {
        interval: "year",
      },
    };
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: products[0].plan.includes("monthly")
            ? monthlyprice_data
            : yearlyprice_data,
        },
      ],

      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // Send back the client secret for payment
    res.json({
      message: "Subscription successfully initiated",
      // @ts-ignore
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionID: subscription.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function CancelSubscription(req: Request, res: Response): Promise<void> {
  const stripe = new Stripe(process.env.STRIPE_SK_Live || "");
  const subscriptionid = req.params.id;

  try {
    // Cancel the subscription immediately
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionid
    );
    res.json({
      message: "Subscription canceled successfully!",
      canceledSubscription,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
async function GetSubscription(req: Request, res: Response): Promise<void> {
  const subscriptionid = req.params.id;

  const stripe = new Stripe(process.env.STRIPE_SK_Live || "");
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionid);
    res.json({
      status: subscription.status,
      customer: subscription.customer,
      start_date: new Date(subscription.start_date * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      plan: subscription.items.data[0].plan.nickname,
      //@ts-ignore
      amount: subscription.items.data[0].plan.amount / 100 +
        " " +
        subscription.currency.toUpperCase(),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function GetSession(req: Request, res: Response): Promise<void> {
  const sessionId = req.params.id;
  const stripe = new Stripe(process.env.STRIPE_SK_Live || "");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({ ...session });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export {
  CreateCheckout,
  GetSubscription,
  CreateSubscription,
  GetSession,
  CancelSubscription,
};
