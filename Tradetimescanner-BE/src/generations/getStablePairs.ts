import OpenAI from "openai";
import { promptDTO } from "../utils/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getStablePairs = async (prompt: promptDTO) => {
  const response = await openai.responses.create({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content:
          "Extract a list of currencies pairs with a minimum of 70% market stability from the historical data and currency rates provided.\n\nEnsure to analyze the dataset thoroughly to identify and extract only those currencies that meet the specified threshold for market stability.\n\n# Steps\n\n1. **Data Review**: Begin by examining the historical data set to understand its structure and location of market stability and currency rate information.\n2. **Identification**: Identify the section or fields that contain historical market stability information for each currency.\n3. **Threshold Check**: For each currency, check if the historic market stability is 70% or higher.\n4. **Extraction**: Compile a list of all currencies that meet or exceed the 70% market stability threshold.\n5. **Recommendation**: Within the extracted list, identify the most recommended pair based on the highest market stability and consistency. Mark it as 'Recommended' and mark the others as 'Not Recommended'.\n\n\n",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: '"rates": { "ADA": 1.4627853745, "AED": 3.672546626, "AFN": 69.741685, "ALL": 84.8234980367, "AMD": 383.4798455, "ANG": 1.789679, "AOA": 916.225103753, "ARS": 1181.4841373785, "AUD": 1.5344660268, "AZN": 1.699089, "BAM": 1.684148, "BBD": 2.0093185, "BDT": 122.1886165, "BGN": 1.6863831703, "BHD": 0.3771538207, "BIF": 2977.0755305, "BNB": 0.0015103901, "BND": 1.2787637375, "BOB": 6.9251038781, "BRL": 5.5350451037, "BSD": 0.999788, "BTC": 0.0000093471, "BTN": 85.444471, "BWP": 13.3414587778, "BYN": 3.271844, "BZD": 2.0129887712, "CAD": 1.362352367, "CDF": 2891.2502325, "CHF": 0.812435, "CLF": 0.0240014633, "CLP": 930.7773350465, "CNY": 7.1804181054, "COP": 4176.98, "CRC": 506.2287973006, "CVE": 95.0842216682, "CZK": 21.389594943, "DJF": 178.0565235, "DKK": 6.4360595182, "DOGE": 5.3190998421, "DOP": 59.0521915924, "DOT": 0.2446095145, "DZD": 130.072389203, "EGP": 49.7724033214, "ERN": 15, "ETB": 137.087601, "ETH": 0.0003651697, "EUR": 0.8628760541, "FJD": 2.241775, "FKP": 0.737707, "GBP": 0.7353941601, "GEL": 2.73384, "GHS": 10.2478765, "GIP": 0.7368414889, "GMD": 71.420349029, "GNF": 8663.9403495, "GTQ": 7.6842696897, "GYD": 209.150653961, "HKD": 7.8491628545, "HNL": 26.0917219781, "HRK": 6.494301, "HTG": 131.172853, "HUF": 345.85214854, "IDR": 16224.9673377713, "ILS": 3.56685, "INR": 85.5659929635, "IQD": 1309.7417595, "IRR": 42002.5940860215, "ISK": 124.3793004875, "JMD": 160.0800155, "JOD": 0.709011, "JPY": 143.459010229, "KES": 129.2632222185, "KGS": 87.4499165, "KHR": 4010.070889, "KMF": 428.5039145, "KRW": 1355.4910193785, "KWD": 0.3057872316, "KYD": 0.8281397334, "KZT": 511.4794757033, "LAK": 21578.887373, "LBP": 89579.9284345, "LINK": 0.0700617924, "LKR": 299.044687067, "LRD": 199.9775775, "LSL": 17.7859306193, "LTC": 0.0112555619, "LYD": 5.4631935, "MAD": 9.092903579, "MDL": 17.063162, "MGA": 4465.9258050952, "MKD": 53.0093155, "MMK": 2097.9519370448, "MNT": 3580.9403968937, "MOP": 8.0836561867, "MRO": 39.591, "MUR": 45.25002, "MVR": 15.432489, "MWK": 1733.4536186776, "MXN": 18.920848296, "MYR": 4.2210717919, "MZN": 63.8003208861, "NAD": 17.7966639334, "NGN": 1539.8271848205, "NIO": 36.7902965, "NOK": 9.963347574, "NPR": 136.7088975, "NZD": 1.6521646659, "OMR": 0.38475, "PAB": 1.000238, "PEN": 3.632709, "PHP": 55.6739925, "PKR": 281.891806, "PLN": 3.68243, "PYG": 7978.129676, "QAR": 3.6458135, "RON": 4.3399485, "RSD": 101.1439985, "RUB": 80.173388, "RWF": 1422.868647, "SAR": 3.751401, "SCR": 14.45561, "SDG": 600.4984315, "SEK": 9.42906, "SGD": 1.27913, "SLL": 21772.950107, "SOL": 0.0062981657, "SOS": 571.3423975, "SRD": 37.2312525, "STN": 21.3444253275, "SVC": 8.7482795, "SYP": 13001.973389, "SZL": 17.7837, "THB": 32.3967495, "TJS": 10.1327115, "TMT": 3.5, "TND": 2.9580785, "TOP": 2.342096, "TRX": 3.6140196636, "TRY": 39.3375495, "TTD": 6.7827225, "TWD": 29.469247, "TZS": 2584.9999455, "UAH": 41.453085, "UGX": 3585.028443, "USD": 1, "USDC": 1.0002505713, "USDT": 1.0000587486, "UYU": 41.309307, "UZS": 12643.776253, "VES": 100.2141995, "VND": 26037.5, "VUV": 119.835654, "XAF": 565.694873, "XCD": 2.702549, "XOF": 565.702032, "XPF": 102.8508435, "XRP": 0.4466668559, "YER": 243.349945, "ZAR": 17.808525, "ZMK": 9001.200733, "ZMW": 24.569832 }',
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",

            text: 'historic data { "date": "2019-10-09", "endpoint": "historical", "quotes": [ { "base_currency": "EUR", "close": 1.09734, "high": 1.09905, "low": 1.09546, "open": 1.09557, "quote_currency": "USD" }, { "base_currency": "GBP", "close": 1.22086, "high": 1.22925, "low": 1.21977, "open": 1.2221, "quote_currency": "USD" }, { "base_currency": "USD", "close": 107.46782, "high": 107.63396, "low": 106.93336, "open": 107.0735, "quote_currency": "JPY" }, { "base_currency": "USD", "close": 1.33348, "high": 1.33388, "low": 1.32953, "open": 1.3325, "quote_currency": "CAD" }, { "base_currency": "USD", "close": 0.99552, "high": 0.99647, "low": 0.99158, "open": 0.99298, "quote_currency": "CHF" }, { "base_currency": "AUD", "close": 0.67239, "high": 0.675, "low": 0.67217, "open": 0.67287, "quote_currency": "USD" }, { "base_currency": "NZD", "close": 0.6289, "high": 0.63256, "low": 0.62868, "open": 0.62958, "quote_currency": "USD" }, { "base_currency": "EUR", "close": 0.89882, "high": 0.8995, "low": 0.8938, "open": 0.89652, "quote_currency": "GBP" }, { "base_currency": "EUR", "close": 117.925, "high": 118.097, "low": 117.209, "open": 117.3065, "quote_currency": "JPY" } ], "request_time": "Thu, 12 Jun 2025 14:05:44 GMT" }',
          },
        ],
      },

      {
        role: "user",
        content: [
          {
            type: "input_text",

            text: "start",
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "currency_data",
        strict: true,
        schema: {
          type: "object",
          properties: {
            currency_data: {
              type: "array",
              description:
                "A collection of currency pair objects containing name and market stability.",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the currency pair.",
                  },
                  market_stability: {
                    type: "number",
                    description:
                      "A numeric representation of the market stability of the currency pair in percentage.",
                    minimum: 0,
                    maximum: 100,
                  },
                  recommended: {
                    type: "string",
                    description: "Whether the currency pair is recommended or not.",
                    enum: ["Recommended", "Not Recommended"],
                  },
                },
                required: ["name", "market_stability", "recommended"],
                additionalProperties: false,
              },
            },
          },
          required: ["currency_data"],
          additionalProperties: false,
        },
      },
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true,
  });

  return JSON.parse(response.output_text);
};

export { getStablePairs };
