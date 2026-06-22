import { Request, Response } from 'express';
import { CCPayment } from '../utils/ccPayment';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const ccPayment = new CCPayment(
  process.env.CCPAYMENT_APP_ID || '',
  process.env.CCPAYMENT_APP_SECRET || ''
);

export const createCCPaymentCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, plan } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const price = plan === 'yearly' ? '300.00' : '35.00';
    const productName = `TradeTimeScanner ${plan === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`;
    const merchantOrderId = uuidv4();

    const response = await ccPayment.createHostedCheckout({
      price: price,
      orderId: merchantOrderId,
      product: productName,
      notifyUrl: `${process.env.API_BASE_URL}/premium/ccpayment/webhook`,
      returnUrl: `${process.env.productionURL}premiumsuccess`,
    });

    if (response.code === 10000) {
      // Store the order ID and plan in the user's record
      await User.update({ 
        subscription_id: merchantOrderId,
        comment: `CCPayment Plan: ${plan}`
      }, { where: { id: userId } });

      res.json({ paymentUrl: response.data.invoiceUrl });
    } else {
      res.status(500).json({ message: 'Failed to create CCPayment checkout', details: response.msg });
    }
  } catch (error: any) {
    console.error('CCPayment Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const ccPaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  const timestamp = req.headers['timestamp'] as string;
  const sign = req.headers['sign'] as string;
  const body = req.body;

  if (!ccPayment.verifyWebhook(timestamp, sign, body)) {
    console.error('Invalid CCPayment signature');
    res.status(400).send('Invalid signature');
    return;
  }

  // V2 structure: { type: "ApiDeposit", msg: { orderId, status } }
  const { orderId, status } = body.msg || {};

  if (status === 'Success') {
    try {
      const user = await User.findOne({ where: { subscription_id: orderId } });
      if (user) {
        const plan = user.comment?.includes('yearly') ? 'yearly' : 'monthly';
        const expiryDate = new Date();
        if (plan === 'yearly') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        await User.update({
          is_sub_before: 'true',
          exp_date: expiryDate.toISOString(),
        }, { where: { id: user.id } });

        console.log(`User ${user.id} subscription activated via CCPayment V2`);
      }
    } catch (error) {
      console.error('Error updating user after CCPayment success:', error);
      res.status(500).send('Internal server error');
      return;
    }
  }

  // CCPayment expects 'success' as plain text response (per research, V2 might expect 'Success' but 'success' is common)
  // Let's use 'Success' to be safe as per documentation snippets if they specify it.
  res.send('Success');
};
