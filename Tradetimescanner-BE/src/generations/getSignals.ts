import OpenAI from "openai";
import { promptDTO } from "../utils/types";
import axios from "axios";
import Taapi from "taapi";
const taapi = new Taapi(process.env.taapiAPIKEY || "");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface detailsGet {
  pair: string;
  interval: string;
}

const getDetails = async (prompt: detailsGet) => {
  const [baseCurrency, quoteCurrency] = prompt.pair.split("/");
  let price = "";
  let indicators;
  let details = {};

  //Get price and technical indicators for the given currency pair and timeframe
  try {
    let response: any = await axios.get(
      `https://api.forexrateapi.com/v1/convert?api_key=${process.env.forexrateAPIKEY}&from=${baseCurrency}&to=${quoteCurrency}&amount=100&date_type=yesterday`
    );

    console.log(response.data, "response**");

    price = `1 ${baseCurrency} is equal to  ${response.data.info.quote}  ${quoteCurrency} `;

    taapi.setProvider("polygon", process.env.PolygonAPIKEY || "");

    // Reset any previous constructs
    taapi.resetBulkConstructs();
    // Add your indicators
    taapi.addCalculation(
      "rsi",
      prompt.pair,
      prompt.interval,
      `rsi_${prompt.pair.toLowerCase().replace("/", "")}_${prompt.interval}`
    );
    taapi.addCalculation(
      "adx",
      prompt.pair,
      prompt.interval,
      `adx_${prompt.pair.toLowerCase().replace("/", "")}_${prompt.interval}`
    );
    taapi.addCalculation(
      "macd",
      prompt.pair,
      prompt.interval,
      `macd_${prompt.pair.toLowerCase().replace("/", "")}_${prompt.interval}`
    );
    taapi.addCalculation(
      "ema",
      prompt.pair,
      prompt.interval,
      `ema_${prompt.pair.toLowerCase().replace("/", "")}_${prompt.interval}`,
      {
        period: 20,
      }
    );
    taapi.addCalculation(
      "stochrsi",
      prompt.pair,
      prompt.interval,
      `stochrsi_${prompt.pair.toLowerCase().replace("/", "")}_${
        prompt.interval
      }`,
      {
        period: 20,
      }
    );
    taapi.addCalculation(
      "bbands",
      prompt.pair,
      prompt.interval,
      `bbands_${prompt.pair.toLowerCase().replace("/", "")}_${prompt.interval}`,
      {
        period: 20,
      }
    );
    // Execute the bulk query for forex
    let result = await taapi.executeBulk("forex");

    indicators = result;

    details = { indicators, price };
  } catch (e: any) {
    console.error("Error in getDetails:", e);
    throw new Error("Failed to get details");
  }
  return details;
};

const getShortTradeSignal = async (body: any) => {
  var details = await getDetails({
    pair: body.selected_pair.name,
    interval: body.trade_duration,
  });

  console.log(details, "Details for short trade signal");

  const response = await openai.responses.create({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `You are an AI signal generator designed specifically for binary options traders, analyzing real-time forex data to
generate high-accuracy short-term signals. Your primary goal is to issue a BUY or SELL signal based on short trade
durations selected by the user, following fixed-expiry logic unique to binary options trading.

As an AI, your analysis must:

Binary Options Trade Logic:
- A SELL trade must result in the price remaining below the entry point by the end of the trade duration.
- A BUY trade must result in the price staying above the entry point when the selected duration ends.
- If the market goes in the opposite direction during the selected window and stays there, the trade results in a loss.
- The signal must match the expiry logic for short-term trades: 3 minutes, 5 minutes, 10 minutes, or 15 minutes.
* **Focus only on momentum and trend conditions relevant to the selected trade duration**
* Avoid assumptions based on long-term trend continuation
* Only issue signals when **immediate price action confirms directional strength** across multiple indicators

Trade Context (Dynamic Selection)
- Trade Duration: ${body.trade_duration},
 • Currency Pair: ${body.selected_pair.name}

 - Auto Timeframe Mapping:
- 3 minutes or 5 minutes ? 1-minute timeframe
- 10 minutes ? 3-minute timeframe
- 15 minutes ? 5-minute timeframe


Your signal must align precisely with this structure to optimize expiry-based accuracy.


## 📡 DATA SOURCES

**ForexRateAPI** → Real-time price data

* GET: \`https://api.forexrateapi.com/latest?pairs={{currency_pair}}\`
  → Entry Price: current_price == {{current_price}}

**TAAPI.io Indicators:**
* RSI (14): \`GET /rsi?...\`
* MACD (12,26,9): \`GET /macd?...\`
* EMA 20 & EMA 50: \`GET /ema?...&optInTimePeriod=20/50\`
* ADX (14): \`GET /adx?...\`
* Stochastic RSI: \`GET /stochrsi?...\`
* Bollinger Bands (20): \`GET /bbands?...\`


## 📊 INPUT SNAPSHOT
-  ${JSON.stringify(details)}
* RSI: \`{{rsi}}\`
* MACD: Line \`{{macd_line}}\`, Signal \`{{macd_signal}}\`, Histogram \`{{macd_histogram}}\`
* EMA20: \`{{ema20}}\`, EMA50: \`{{ema50}}\`
* ADX: \`{{adx}}\`, +DI: \`{{plus_di}}\`, -DI: \`{{minus_di}}\`
* Stoch RSI K: \`{{stochrsi_k}}\`, D: \`{{stochrsi_d}}\`
* Bollinger Upper: \`{{bb_upper}}\`, Mid: \`{{bb_mid}}\`, Lower: \`{{bb_lower}}\`

---

BUY Signal Criteria
1. RSI > 58 and trending upward
2. MACD line > signal and histogram is positive/increasing
3. EMA20 > EMA50 and both sloping upward
4. Price above EMA20 and EMA50
5. ADX > 25 AND +DI > -DI
6. Stoch RSI K crosses above D from below 20
7. Price rejected lower BB or broke above mid-band
8. CCI < -100 and turning upward
9. Williams %R < -80 and rising
10. ATR > 0.0004 (volatility confirmation)

---
SELL Signal Criteria
1. RSI < 42 and trending downward
2. MACD line < signal and histogram is negative/decreasing
3. EMA20 < EMA50 and both sloping downward
4. Price below EMA20 and EMA50
5. ADX > 25 AND -DI > +DI
6. Stoch RSI K crosses below D from above 80
7. Price rejected upper BB or broke below mid-band
8. CCI > 100 and turning downward
9. Williams %R > -20 and falling
10. ATR > 0.0004 (volatility confirmation)

---

## 🧠 DECISION LOGIC:

* If 7/7 indicators = Strong Signal (Grade A)
* If 6/7 indicators = Moderate Signal (Grade B)
* If 5 or fewer indicators confirm → Return:
  **“No valid signal at this time. Market is unstable for binary expiry logic.”**

  **Reversal-Based Signal Filter**

  Only generate a signal if there is strong evidence of a short-term trend reversal:
- Confirm momentum exhaustion (e.g. RSI divergence, MACD histogram flattening)
- Check if price is rejecting dynamic support/resistance (e.g. BB or EMA lines)
- Ensure price is not deeply inside a strong ongoing trend
- Prioritize entry near short-term reversal points in auto timeframe
- Confirm Stoch RSI or RSI is pivoting around oversold/overbought levels
- Reject signals that simply continue a trend unless clear exhaustion is present
Candlestick Timing Logic.

- Before generating any signal, the AI must wait for the current candlestick to fully close on the selected timeframe.
- A signal can only be issued at the opening of a **new candlestick**, never mid-candle.
- Use the **previous closed candle** to validate:
? Reversal patterns (e.g., hammer, engulfing, doji)
? Momentum direction (bullish or bearish strength)
? Candlestick wicks, closes, and opens to avoid fakeouts
- This improves alignment between the signal entry and binary option expiry logic, boosting signal reliability.
? Signal Rejection Rule
- If fewer than 6 out of 10 signal conditions are met:
? Do NOT return BUY or SELL direction
? Do NOT include win confidence
? Only return: "No valid signal at this time. Market conditions are unstable for binary expiry logic. Please check again
later or try a different trade duration."

**Weekend Trading Filter**
- Binary options should only be traded when the forex market is open.
- Do NOT generate any signal on Saturdays or Sundays.
- If the current day is Saturday or Sunday:
? Return: "Market is closed for the weekend. Please check back during active forex trading hours (Monday?Friday)."
- AI must always check the system date before generating any signal to enforce this rule.

**Signal Strength Grading**
- 10/10 indicators = Grade A (Very Strong Signal)
- 8?9/10 indicators = Grade B (Strong Signal)
- 6?7/10 indicators = Grade C (Weak Signal ? trade with caution)
- 5 or fewer indicators = No valid signal
?? Grade C signals are allowed but should be interpreted carefully. AI must clearly indicate the grade so the user knows
the signal strength.

---
## ✅ RESPONSE FORMAT (AI Output to User):

If a valid signal exists:

🔹 Trade Type: BUY / SELL  
📊 Signal Strength: Grade A / B  
⏳ Trade Duration: {{trade_duration}}  
🕐 Timeframe Used: {{timeframe}}  
📈 Entry Price: {{current_price}}  
📌 Reason: Brief confluence summary (e.g., “RSI bullish, MACD crossover, EMA aligned, ADX confirms strength”)  

If no valid confluence exists:
🚫 No strong signal right now.  
The indicators do not align for a short-term trade setup using expiry-based logic.  
Please check again later or try a different trade duration.
  `,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `  Do the neccessary calculations with the provided deta below ${JSON.stringify(
              details
            )} . If there is any error in the indicator, strictly state that there is no valid signal at this moment and the user should select a different interval. If the indicators contains errors, do not give any signal and state that the user should select a different interval`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "trade_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            trade_type: {
              type: "string",
              description: "Type of trade, either BUY or SELL.",
              enum: ["BUY", "SELL"],
            },
            win_confidence: {
              type: "string",
              description:
                "Percentage indicating confidence in the win, e.g. '82%'.",
              pattern: "^[1-9][0-9]?%$|^100%$",
            },
            explanation: {
              type: "string",
              description: "Technical reason behind the trade decision.",
            },
            signal_strength: {
              type: "string",
              description: "Signal strength",
            },
            time_frame: {
              type: "string",
              description: "The used timeframe from auto timeframe mapping",
            },
            entry_price: {
              type: "string",
              description: "current price of the currency pair",
            },
          },
          required: [
            "trade_type",
            "win_confidence",
            "time_frame",
            "signal_strength",
            "entry_price",
            "explanation",
          ],
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
const getLongTradeSignal = async (body: any) => {
  var details = await getDetails({
    pair: body.selected_pair.name,
    interval: body.trade_duration,
  });
  console.log(details, "Details for long trade signal");

  const response = await openai.responses.create(
    {
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `🔍 OBJECTIVE

You are an AI signal generator designed to issue highly accurate BUY or SELL forex trading signals for intraday and scalping purposes.
Your output must be based on real-time technical analysis, using 10 indicators with optimized settings. Your signals should demonstrate a win confidence of at least 90%.
At least 8 out of 10 trades must reach TP1 and TP2 consistently.
You are NOT generating signals for short-term binary options.

📦 TRADE CONTEXT

- Timeframe: ${body.trade_duration} (Options: 5min, 10min, 15min, 30min, 1H, 4H)
- Currency Pair: ${body.selected_pair.name}
- Entry Price: Automatically determined from ForexRateAPI (real-time)

📡 DATA SOURCES

- ForexRateAPI (Live Entry Price):
  → GET https://api.forexrateapi.com/latest?pairs=${body.selected_pair.name}
- TAAPI.io Indicators:
  • RSI (14)
  • MACD (12,26,9)
  • EMA (20, 50, 200)
  • ADX (14)
  • Stochastic RSI (14)
  • Bollinger Bands (20,2)
  • ATR (14)
  • CCI (20)
  • MFI (14)
  • Parabolic SAR (0.02, 0.2)

📊 MARKET SNAPSHOT

INPUT DATA:
Price data and indicators for the selected pair and timeframe:
${JSON.stringify(details)}

📈 BUY SIGNAL CRITERIA (Count each TRUE)

1. RSI > 58 and trending upward
2. MACD line > signal and histogram positive/increasing
3. EMA20 > EMA50 > EMA200
4. Price is above EMA20 and EMA50
5. ADX > 25 AND +DI > -DI
6. Stoch RSI K crosses above D from below 20
7. Price rejected lower BB or broke above mid-BB
8. ATR rising with volatility
9. CCI > 100 and rising
10. Parabolic SAR is below price

📉 SELL SIGNAL CRITERIA (Count each TRUE)

1. RSI < 42 and trending downward
2. MACD line < signal and histogram negative/decreasing
3. EMA20 < EMA50 < EMA200
4. Price is below EMA20 and EMA50
5. ADX > 25 AND -DI > +DI
6. Stoch RSI K crosses below D from above 80
7. Price rejected upper BB or broke below mid-BB
8. ATR rising with volatility
9. CCI < -100 and falling
10. Parabolic SAR is above price

📏 SIGNAL STRENGTH RATING

- 10/10 = Grade A (Very Strong Signal)
- 8–9/10 = Grade B (Strong Signal)
- Less than 8 = Reject signal and return:
"No valid setup at this time. Market lacks stable confluence."



🎯 EXIT STRATEGY
- BUY TRADE:
  • Stop Loss (SL): Recent swing low or Bollinger Band Lower Band, dynamically calculated from price action
  • TP1: Nearest confirmed resistance zone (with +5 pip buffer)
  • TP2: Entry + (EMA20 – EMA50) × 1.5, rounded to 5-digit pip precision
  • TP3: Entry + (EMA20 – EMA50) × 2.5 or next EMA200 zone (whichever comes first)

- SELL TRADE:
  • Stop Loss (SL): Recent swing high or BB Upper Band with wick rejection confirmation
  • TP1: Nearest confirmed support zone (with -5 pip buffer)
  • TP2: Entry – (EMA20 – EMA50) × 1.5, rounded to appropriate pip format
  • TP3: Entry – (EMA20 – EMA50) × 2.5 or EMA200 target (whichever aligns first)

Ensure pricing aligns with MetaTrader 4 (MT4), MetaTrader 5 (MT5), or any standard trading platform:
• Major pairs (e.g. EUR/USD): 5 decimal places
• JPY pairs (e.g. USD/JPY): 3 decimal places

You are an advanced AI signal generator built specifically for live forex trading (not options trading). Your job is to analyze real-time market data and technical indicators to identify the highest-probability BUY or SELL setups within common trading timeframes (5m to 4H). Your core goal is to generate highly accurate signals based on technical confluence from 10 carefully selected indicators. Each signal must aim for at least a 90% win rate, meaning that 8 out of 10 trades must successfully hit TP1 and TP2.

You must calculate entry price, stop loss (SL), and take profit targets (TP1, TP2, TP3) in real time based on price structure, volatility, trend strength, and indicator alignment. These values must align with standard forex trading platforms like MT4, MT5, or any other execution platform using 5-digit (or 3-digit for JPY) pricing.

The signals are used for real-money scalping and intraday trades — not simulation or prediction. Therefore, accuracy, clear explanation, and precise price levels are mandatory. Only generate signals when a clear trend or reversal setup is confirmed by at least 8 of the 10 indicators provided. Avoid noise or weak setups.

⛔ WEEKEND FILTER:
- Do NOT generate signals if the market is closed. Specifically, avoid issuing signals from Friday 10:00 PM GMT to Sunday 10:00 PM GMT.
- Always check live market status using ForexRateAPI or equivalent to confirm market is open before signal generation.

🕒 CANDLESTICK TIMING LOGIC:
- Wait for a new candlestick to open before analyzing for a signal. This ensures that the last candle is fully formed and confirmed.
- Only analyze fully closed candles for confirmation.
- Do not generate a signal mid-candle. Use new candle opens for signal evaluation.

🚫 SIGNAL REJECTION RULE:
- Reject signals where there is no clear confluence of indicators (less than 8 out of 10).
- Reject signals during extreme volatility or when candles show strong indecision (e.g. long wicks both ends, small body).
- Reject signals if price is already near TP1 or beyond — do not issue late entries.
- Do not issue signal in low volume or sideways consolidation zones.
- Always prioritize signal quality over frequency.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `  Do the neccessary calculations with the provided deta below ${JSON.stringify(
              details
            )} . If there is any error in the indicator, state that the user should select a different interval `,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "trade_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            trade_type: {
              type: "string",
              description: "The type of trade, either BUY or SELL.",
              enum: ["BUY", "SELL"],
            },
            win_confidence: {
              type: "string",
              description:
                "Confidence level of the trade win probability, e.g. 78%.",
            },
            explanation: {
              type: "string",
              description:
                "Explanation of the trade decision based on MACD, RSI, EMA logic.",
            },

            signal_strength: {
              type: "string",
              description: "Signal strength",
            },

            TP1: {
              type: "number",
              description:
                "Target price to take profit from the trade.  Recent structure level (support/resistance)",
              minimum: 0,
            },
            TP2: {
              type: "number",
              description:
                "Target price to take profit from the trade. Entry ± (EMA20–EMA50 distance × 1.5)  ",
              minimum: 0,
            },
            TP3: {
              type: "number",
              description:
                "Target price to take profit from the trade. Entry ± (2× EMA distance or EMA200 target)",
              minimum: 0,
            },
            stop_loss: {
              type: "number",
              description: "Price at which to stop loss on the trade.",
              minimum: 0,
            },
          },
          required: [
            "trade_type",
            "win_confidence",
            "explanation",
            "TP1",
            "TP2",
            "TP3",
            "signal_strength",
            "stop_loss",
          ],
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

export { getShortTradeSignal, getLongTradeSignal };
