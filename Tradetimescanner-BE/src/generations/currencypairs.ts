import OpenAI from "openai";
import { promptDTO } from "../utils/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const GetCurrencypairs = async (prompt: promptDTO) => {
  let messages: any;

  var genericmarketcontext = [
    {
      role: "system",

      content: [
        {
          type: "text",
          text: `Identify profitable ${prompt.market} items to trade at a specific time. Provide a list of ${prompt.market} items that are most profitable for trading at the current period of time. For each item, include a brief rationale explaining why it is profitable. # Output Format Your response should strictly be in the following JSON format without any code block: json {  "items": [   "[item_1]",    "[item_2]",   "[item_3]",   "... (repeat as needed)" ], "details": {   "[item_1]": "[rationale for why this ${prompt.market} items is currently profitable]",    "[item_2]": "[rationale for why this item is currently profitable]",   "[item_3]": "[rationale for why this ${prompt.market} items is currently profitable]",   "...": "..." }} The "items" field should contain an array listing all profitable ${prompt.market} items.- The "details" field should provide the rationale for each item listed in "items." # Example**Example Output:** json {  "items": [ ...items ], "details": {    ...details  } }nNote: Replace the ${prompt.market} items and rationales as per the current market trends.`,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Give me 4-10 best and most stable items of the ${prompt.market} items to trade today  ${prompt.date} from ${prompt.starttime}  to ${prompt.endtime} timezone: ${prompt.timezone}`,
        },
      ],
    },
  ];
  var commoditymarketcontext = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: 'Identify profitable commodities to trade at a specific time.\n\nProvide a list of commodities that are most profitable for trading at the current period of time. For each commodity, include a brief rationale explaining why it is profitable.\n\n# Output Format\n\nYour response should strictly be in the following JSON format without any code block:\n\n```json\n{\n  "items": [\n    "[commodity_1]",\n    "[commodity_2]",\n    "[commodity_3]",\n    "... (repeat as needed)"\n  ],\n  "details": {\n    "[commodity_1]": "[rationale for why this commodity is currently profitable]",\n    "[commodity_2]": "[rationale for why this commodity is currently profitable]",\n    "[commodity_3]": "[rationale for why this commodity is currently profitable]",\n    "...": "..."\n  }\n}\n```\n\n- The "items" field should contain an array listing all profitable commodities.\n- The "details" field should provide the rationale for each commodity listed in "pairs." \n\n# Examples\n\n**Example Output:**\n\n```json\n{\n  "items": [\n    "Gold",\n    "Crude Oil",\n    "Soybeans"\n  ],\n  "details": {\n    "Gold": "Gold prices are increasing due to economic instability, making it a strong hedge for investors.",\n    "Crude Oil": "Reduced production from major suppliers and an increase in energy demand has pushed up oil prices.",\n    "Soybeans": "Increased global demand and low crop yield forecasts are driving prices higher."\n  }\n}\n```\n\nNote: Replace the commodities and rationales as per the current market trends.',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Give me 4-10 best and most stable commodities of the commodity market to trade today  ${prompt.date} from ${prompt.starttime}  to ${prompt.endtime} timezone: ${prompt.timezone}`,
        },
      ],
    },
  ];
  var stockcontext = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: 'Identify the most profitable and best stock market symbols for trading.\n\nConsider various factors while determining these symbols, such as economic trends, financial performance, market sectors, and any recent developments that could affect market value. Provide stock symbols that are likely to be profitable for traders, taking into consideration both long-term growth and short-term opportunities. \n\n# Steps\n\n1. **Data Analysis**:\n   - Evaluate recent economic trends and factors that may influence certain industries.\n   - Look at the financial performance of various companies.\n   - Consider technical analysis indicators for identifying upcoming trends.\n  \n2. **Stock Selection**:\n   - Choose stocks that have a strong upward movement or good momentum.\n   - Prefer stocks from industries with recent positive trends.\n   - Use both qualitative and quantitative analysis to assess the strength of each stock.\n\n3. **Rationale**:\n   - Explain why these particular stock symbols were selected.\n   - Reference any specific data points, trends, or industry news that contributed to determining the profitability of these symbols. \n\n# Output Format\n\nThe response must be in JSON format as described below:\n- **items**: An array of stock market symbols that are considered profitable, represented as strings.\n- **details**: An explanation providing the reasoning or strategy behind the selection of these particular symbols.\n\n```json\n{\n    "items": [\n        "AAPL",\n        "TSLA",\n        "AMZN"\n    ],\n    "details": [\n        "AAPL shows excellent growth opportunities due to recent product releases and a strong earnings report.",\n        "TSLA has significant upward momentum based on new market expansions and increased electric vehicle demand.",\n        "AMZN benefits from strong ecommerce revenue growth and operational efficiency."\n    ]\n}\n```\n\n# Notes\n\n- Provide at least 3-5 stock market symbols with associated rationales.\n- Make sure each rationale is concise but provides useful insights into why that symbol is profitable.\n- Base your selection on the latest available information to ensure the recommendations are relevant.\n- Do not use code blocks around the JSON response—you must provide plain, formatted JSON structure only.',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Give me the best and most stable market symbols to trade today ${prompt.date} in the stock market from ${prompt.starttime} to ${prompt.endtime}  timezone: ${prompt.timezone}`,
        },
      ],
    },
  ];

  const forexcontext = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: 'Identify profitable currency pairs for trading at specific times of the day, based on market conditions, historical trends, volatility, and other relevant data.\n\n# Guidelines\n\n- Consider factors that affect the profitability of currency pairs, such as volatility, current market trends, economic indicators, time of day, and relevant news.\n\n- Suggest the ideal trading times for each currency pair, considering peak trading sessions like London, New York, and Tokyo.\n- Avoid recommending unsound trades. Make conclusions based on clear, reasonable logic and data.\n\n# Steps\n\n1. **Assess Market Trends**: Analyze recent market data, economic indicators, and news to identify which currency pairs may be moving significantly.\n2. **Consider Volatility and Liquidity**: Evaluate the volatility and liquidity of currency pairs. Indicate pairs that tend to be most profitable at different times.\n3. **Time of Day for Trading**: Factor in the specific time of day for optimal trading given peak liquidity sessions across different markets.\n4. **Recommend Currency Pairs**: Recommend the best profitable currency pairs, providing reasons aligned with market conditions.\n\n# Output Format\n\nYour response should strictly be JSON in this format  array containing list of currency pairs only\n {pairs:\n[ "/...", \n...\n]\ndetails: [each currency  pair:"rationale for currency   pair"]\n}\n```\n\n# Notes\n\n- Ensure recommendations are data-driven and consider market-specific timing.\n- Emphasize trades that align with typical market activity, such as trading during overlapping sessions (i.e., London/New York for high liquidity).\n- Avoid recommending exotic pairs with low liquidity unless there are strong compelling reasons.\n- If market data is not available, provide educated estimations using typical pattern behavior.',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Give me 4-10 ${prompt.market} best and most stable currency pairs of the ${prompt.market}  to trade today ${prompt.date} in ${prompt.timezone} timezone from ${prompt.starttime} to ${prompt.endtime} in the ${prompt.market} `,
        },
      ],
    },
  ];

  console.log("market...", prompt.market);

  switch (prompt.market) {
    case "Forex":
      messages = forexcontext;
      break;
    case "Stock Markets":
      messages = stockcontext;
      break;
    case "Commodity Markets":
      messages = commoditymarketcontext;

      break;
    case "OTC (Over-the-Counter)":
      messages = forexcontext;

      break;
    case "Index Markets (ETF and Index Funds)":
      messages = genericmarketcontext;

      break;
    case "Futures and Options Markets":
      messages = genericmarketcontext;

      break;
    case "Bond Markets":
      messages = genericmarketcontext;
      break;

    case "Cryptocurrency Exchanges":
      messages = forexcontext;

    default:
      messages = genericmarketcontext;
      break;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              description: "A list of items.",
              items: {
                type: "string",
              },
            },
            details: {
              type: "array",
              description:
                "Rationale or analysis for each item in the item array",
              items: {
                type: "string",
              },
            },
          },
          required: ["items", "details"],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content ?? "");
};
const GetTadeStrategy = async (prompt: any) => {
  console.log(prompt);

  const messages: any = [
    {
      role: "system",
      content:
        "You are a professional trading strategy advisor. Provide a comprehensive trading strategy with the provided indicator combination, trade time and timeframe",
    },
    {
      role: "user",
      content: `Provide the required settings for this indicator combination: ${prompt.indicators.join(
        ","
      )}. Trade time: ${prompt.tradetime}. Time frame: ${prompt.timeframe}. `,
    },
  ];
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "trading_strategy_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            recommendedIndicators: {
              type: "array",
              description:
                "Array of each recommended indicator's settings with names and indicator settings",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the indicator",
                  },
                  explanation: {
                    type: "string",
                    description:
                      "recommended setting of the particular indicator",
                  },
                },
                required: ["name", "explanation"],
                additionalProperties: false,
              },
            },
            recommendedtradetime: {
              type: "string",
              description: "Recommended trading time",
            },
            recommendedtimeframe: {
              type: "string",
              description: "Recommended timeframe",
            },
            strategyexplanation: {
              type: "string",
              description:
                "short explanation for the recommended strategy settings",
            },
          },
          required: [
            "recommendedIndicators",
            "recommendedtradetime",
            "recommendedtimeframe",
            "strategyexplanation",
          ],
          additionalProperties: false,
        },
      },
    },
  });
  return JSON.parse(response.choices[0].message.content ?? "");
};
const GetIndicatorRecommendations = async (prompt: any) => {
  console.log("Indicator recommendations prompt:", prompt);

  const messages: any = [
    {
      role: "system",
      content:
        "You are an AI trading strategy generator specialized in binary options trading. Your task is to generate binary option trading strategies with correct indicator inputs, clear strategy explanations, and structured chart annotations for TradingView Lightweight Charts integration.\n\n# Requirements:\n- Each indicator input must include full indicator input settings (parameters) for every indicator chosen or recommended\n- Example: Bollinger Bands → Period: 10, Deviation: 2\n- Provide clear and structured step-by-step strategy explanations\n- Include the role of each indicator, how they combine to confirm an entry, and best conditions to trade\n- Always format in professional, easy-to-follow style\n- Recommend 4-6 currency pairs based on current market stability and user timezone/session\n- All explanations must be tailored for binary options trading style, not forex swing trading\n- Include trade expiry duration recommendations (1m, 3m, 5m, 10m, 15m, etc.)\n- Add Time Frame for chart analysis and Trade Duration for expiry setting\n- Generate structured chart annotation data including:\n  * Markers for CALL/PUT signals with timestamps, colors, shapes, and positions\n  * Indicator overlay data for technical indicators (Bollinger Bands, RSI, MACD, etc.)\n  * Trend lines for support/resistance levels with start/end coordinates\n  * Price zones for overbought/oversold areas\n- All chart data must be in the exact format specified in the schema for TradingView Lightweight Charts compatibility",
    },
    {
      role: "user",
      content: `Generate a complete binary options trading strategy for:
Market Type: ${prompt.markettype}
Trading Timing: ${prompt.timming}
User Timezone/Session: ${prompt.timezone || prompt.session || "London"}
${prompt.timeframe ? `Timeframe: ${prompt.timeframe}` : ""}
${prompt.tradetime ? `Trade Time: ${prompt.tradetime}` : ""}
${
  prompt.indicators && prompt.indicators.length > 0
    ? `Selected Indicators: ${prompt.indicators.join(", ")}`
    : "Please recommend 3 best indicators"
}

Provide:
1. ${
        prompt.indicators && prompt.indicators.length > 0
          ? `Use the selected indicators (${prompt.indicators.join(
              ", "
            )}) with full parameter settings`
          : "Recommend 3 best indicators with full parameter settings"
      }
2. Step-by-step strategy explanation tailored for binary options
3. 4-6 best currency pairs for current session and market stability
4. Trade plan with entry conditions and expiry durations
5. Structured chart annotations for TradingView Lightweight Charts including:
   - Markers for CALL/PUT signals with exact timestamps, colors (green for CALL, red for PUT), arrow shapes, and proper positioning
   - Indicator overlay data with time-series data points for technical indicators
   - Trend lines with start/end coordinates for support/resistance levels
   - Price zones for overbought/oversold areas with proper color coding

Focus specifically on binary options trading with clear CALL/PUT entry signals and provide all chart data in the exact format required for TradingView Lightweight Charts integration.`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 1,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "binary_options_strategy_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            recommendedIndicators: {
              type: "array",
              description:
                "Array of recommended indicators with full parameter settings for binary options trading",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the indicator",
                  },
                  settings: {
                    type: "string",
                    description:
                      "Full indicator input settings with specific parameters (e.g., Bollinger Bands → Period: 10, Deviation: 2)",
                  },
                  role: {
                    type: "string",
                    description:
                      "Role of this indicator in the strategy (e.g., Trend Identification, Momentum Confirmation, Volatility Check)",
                  },
                },
                required: ["name", "settings", "role"],
                additionalProperties: false,
              },
            },
            strategyExplanation: {
              type: "string",
              description:
                "Clear, structured but concise step-by-step explanation of how the strategy works, including how indicators combine to confirm entries and best conditions to trade- keep in simple",
            },
            recommendedPairs: {
              type: "array",
              description:
                "4-6 best currency pairs for current market stability and user session",
              items: {
                type: "object",
                properties: {
                  pair: {
                    type: "string",
                    description: "Currency pair symbol (e.g., EUR/USD)",
                  },
                  rationale: {
                    type: "string",
                    description:
                      "Brief explanation why this pair is optimal for binary options trading in the current session",
                  },
                },
                required: ["pair", "rationale"],
                additionalProperties: false,
              },
            },
            tradePlan: {
              type: "object",
              description:
                "Trade plan with entry conditions and expiry durations for binary options",
              properties: {
                entryConditions: {
                  type: "string",
                  description:
                    "Specific entry conditions for CALL and PUT trades based on indicator signals",
                },
                expiryDurations: {
                  type: "array",
                  description:
                    "Recommended trade expiry durations for binary options",
                  items: {
                    type: "string",
                  },
                },
                timeframe: {
                  type: "string",
                  description: "Recommended time frame for chart analysis",
                },
                tradeDuration: {
                  type: "string",
                  description: "Recommended trade duration for expiry setting",
                },
              },
              required: [
                "entryConditions",
                "expiryDurations",
                "timeframe",
                "tradeDuration",
              ],
              additionalProperties: false,
            },
            chartAnnotations: {
              type: "object",
              description:
                "Structured chart annotation data for TradingView Lightweight Charts integration",
              properties: {
                markers: {
                  type: "array",
                  description:
                    "Chart markers for CALL/PUT signals with timestamps and price levels",
                  items: {
                    type: "object",
                    properties: {
                      time: {
                        type: "string",
                        description:
                          "Timestamp for the marker (ISO format or Unix timestamp)",
                      },
                      position: {
                        type: "string",
                        enum: ["aboveBar", "belowBar", "inBar"],
                        description:
                          "Position of the marker relative to the bar",
                      },
                      color: {
                        type: "string",
                        description: "Color of the marker (hex color code)",
                      },
                      shape: {
                        type: "string",
                        enum: ["circle", "square", "arrowUp", "arrowDown"],
                        description: "Shape of the marker",
                      },
                      text: {
                        type: "string",
                        description:
                          "Text to display on the marker (e.g., 'CALL', 'PUT')",
                      },
                      size: {
                        type: "number",
                        description: "Size of the marker (1-3)",
                      },
                    },
                    required: [
                      "time",
                      "position",
                      "color",
                      "shape",
                      "text",
                      "size",
                    ],
                    additionalProperties: false,
                  },
                },
                indicatorOverlays: {
                  type: "array",
                  description:
                    "Technical indicator overlay data for chart display",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description:
                          "Name of the indicator (e.g., 'Bollinger Bands', 'RSI')",
                      },
                      type: {
                        type: "string",
                        enum: ["line", "histogram", "area", "candlestick"],
                        description: "Type of overlay visualization",
                      },
                      data: {
                        type: "array",
                        description: "Array of data points for the indicator",
                        items: {
                          type: "object",
                          properties: {
                            time: {
                              type: "string",
                              description: "Timestamp for the data point",
                            },
                            value: {
                              type: "number",
                              description:
                                "Value of the indicator at this time",
                            },
                          },
                          required: ["time", "value"],
                          additionalProperties: false,
                        },
                      },
                      color: {
                        type: "string",
                        description: "Color of the indicator line/area",
                      },
                      lineWidth: {
                        type: "number",
                        description: "Width of the indicator line",
                      },
                    },
                    required: ["name", "type", "data", "color", "lineWidth"],
                    additionalProperties: false,
                  },
                },
                trendLines: {
                  type: "array",
                  description: "Trend lines for support/resistance levels",
                  items: {
                    type: "object",
                    properties: {
                      startTime: {
                        type: "string",
                        description: "Start timestamp of the trend line",
                      },
                      endTime: {
                        type: "string",
                        description: "End timestamp of the trend line",
                      },
                      startPrice: {
                        type: "number",
                        description: "Start price of the trend line",
                      },
                      endPrice: {
                        type: "number",
                        description: "End price of the trend line",
                      },
                      color: {
                        type: "string",
                        description: "Color of the trend line",
                      },
                      lineWidth: {
                        type: "number",
                        description: "Width of the trend line",
                      },
                      lineStyle: {
                        type: "string",
                        enum: ["solid", "dashed", "dotted"],
                        description: "Style of the trend line",
                      },
                      text: {
                        type: "string",
                        description:
                          "Label for the trend line (e.g., 'Support', 'Resistance')",
                      },
                    },
                    required: [
                      "startTime",
                      "endTime",
                      "startPrice",
                      "endPrice",
                      "color",
                      "lineWidth",
                      "lineStyle",
                      "text",
                    ],
                    additionalProperties: false,
                  },
                },
                zones: {
                  type: "array",
                  description: "Price zones for overbought/oversold areas",
                  items: {
                    type: "object",
                    properties: {
                      startTime: {
                        type: "string",
                        description: "Start timestamp of the zone",
                      },
                      endTime: {
                        type: "string",
                        description: "End timestamp of the zone",
                      },
                      startPrice: {
                        type: "number",
                        description: "Start price of the zone",
                      },
                      endPrice: {
                        type: "number",
                        description: "End price of the zone",
                      },
                      color: {
                        type: "string",
                        description: "Color of the zone",
                      },
                      opacity: {
                        type: "number",
                        description: "Opacity of the zone (0-1)",
                      },
                      text: {
                        type: "string",
                        description:
                          "Label for the zone (e.g., 'Overbought', 'Oversold')",
                      },
                    },
                    required: [
                      "startTime",
                      "endTime",
                      "startPrice",
                      "endPrice",
                      "color",
                      "opacity",
                      "text",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["markers", "indicatorOverlays", "trendLines", "zones"],
              additionalProperties: false,
            },
          },
          required: [
            "recommendedIndicators",
            "strategyExplanation",
            "recommendedPairs",
            "tradePlan",
            "chartAnnotations",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content ?? "");
};
// Import additional strategy functions
import { GetForexStrategy } from "./additionalStrategies";
import { GetCryptoStrategy } from "./cryptoStrategy";
import { GetGoldStrategy } from "./goldStrategy";
import { GetIndicesStrategy } from "./indicesStrategy";

export {
  GetCurrencypairs,
  GetTadeStrategy,
  GetIndicatorRecommendations,
  GetForexStrategy,
  GetCryptoStrategy,
  GetGoldStrategy,
  GetIndicesStrategy,
};
