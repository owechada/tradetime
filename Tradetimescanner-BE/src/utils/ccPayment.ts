import crypto from 'crypto';
import axios from 'axios';

export class CCPayment {
  private appId: string;
  private appSecret: string;
  private createInvoiceUrlEndpoint = 'https://ccpayment.com/ccpayment/v2/createInvoiceUrl';

  constructor(appId: string, appSecret: string) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  async createHostedCheckout(data: {
    orderId: string;
    price: string;
    product: string;
    returnUrl: string;
    notifyUrl: string;
    priceFiatId?: string;
  }) {
    const timestamp = Math.floor(Date.now() / 1000);
    
    const content = {
      orderId: data.orderId,
      price: data.price,
      priceCoinId: "1280",
     // priceFiatId: data.priceFiatId || "1033",
      product: data.product,
      returnUrl: data.returnUrl,
      notifyUrl: data.notifyUrl,
    };

    let body = JSON.stringify(content);
    
    let signText = this.appId + timestamp;
    if (body.length !== 2) { // Check if the body is an empty object
        signText += body;
    } else {
        body = "";
    }

    const serverSign = crypto
      .createHmac('sha256', this.appSecret)
      .update(signText)
      .digest('hex');

    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Appid': this.appId,
      'Sign': serverSign,
      'Timestamp': timestamp.toString()
    };

    const response = await axios.post(this.createInvoiceUrlEndpoint, body, {
      headers: headers
    });
console.log(response)
    return response.data;
  }

  verifyWebhook(timestamp: string, sign: string, body: any): boolean {
    let bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    let signText = this.appId + timestamp;
    
    if (bodyStr.length !== 2) {
      signText += bodyStr;
    }

    const expectedSign = crypto
      .createHmac('sha256', this.appSecret)
      .update(signText)
      .digest('hex');
      
    return expectedSign === sign;
  }
}
