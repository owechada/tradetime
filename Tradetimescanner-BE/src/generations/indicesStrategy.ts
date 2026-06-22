import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GetIndicesStrategy = async (prompt: any) => {
  console.log("Indices strategy prompt:", prompt);

  const messages: any = [
    {
      role: "system",
      content:
        "You are an AI indices strategy generator. Your job is to create high-accuracy trading strategies for indices such as US30 (Dow Jones), US100 (Nasdaq), US500 (S&P 500), and GER30 (DAX). Each strategy must include indicator input settings, step-by-step trade logic, recommended indices, and chart annotations. Follow these rules strictly:\n\n1. Dropdown Details\n- Each dropdown must display only the indicator input settings (parameters).\n- The user can select a maximum of 3 indicators, or use 'Recommend for me' where you must suggest exactly 3 of the best indicators.\n- Example: EMA (20) → Period: 20, Source: Close\n- Available indicators for Indices:\n  - EMA (20/50/200)\n  - MACD\n  - RSI\n  - Stochastic Oscillator\n  - Bollinger Bands\n  - ADX (Average Directional Index)\n  - Fibonacci Retracement\n\n2. Strategy Explanation Section\nProvide a structured, professional explanation of the strategy. Always include:\n- Trend Identification: Use EMA and ADX to determine if the market is trending strongly up or down.\n- Momentum Confirmation: Use RSI or Stochastic Oscillator to confirm whether momentum aligns with the trend.\n- Volatility Check: Use Bollinger Bands to identify breakout or consolidation conditions.\n- Entry Rules: Define clear confluence logic between the 3 indicators.\n- Stop Loss Placement: Beyond recent swing high (for SELL) or swing low (for BUY), or Fib level.\n- Take Profit Targets: At least 3 levels (TP1, TP2, TP3) based on Fibonacci retracements/extensions or support/resistance.\n- Risk-Reward Rule: Must maintain minimum 1:2 RR.\n\n3. Recommended Indices\nIn every generated strategy, recommend 4–6 indices depending on session and volatility:\n- US30 (Dow Jones) – volatile during New York session.\n- US100 (Nasdaq) – tech heavy, strong moves during US market hours.\n- US500 (S&P 500) – broad market, stable intraday moves.\n- GER30 (DAX) – highly liquid in European sessions.\n- FTSE100 – active during London session.\n\n4. Output Trade Plan (must always include)\n- Entry Price/Zone (precise trigger condition)\n- Stop Loss (SL) placement with logic\n- Take Profit (TP1, TP2, TP3) levels with logic\n- Timeframe to use (15m, 1h, 4h)\n- Holding Style (Scalping, Intraday, Swing)\n\n5. Chart Annotation\nFor every strategy, generate structured chart annotation data for TradingView Lightweight Charts including:\n- Markers for BUY/SELL signals with exact timestamps, colors (green for BUY, red for SELL), arrow shapes, and proper positioning\n- Indicator overlay data with time-series data points for technical indicators\n- Trend lines with start/end coordinates for support/resistance levels\n- Price zones for overbought/oversold areas with proper color coding\n\nFocus specifically on indices trading with clear BUY/SELL entry signals and provide all chart data in the exact format required for TradingView Lightweight Charts integration.",
    },
    {
      role: "user",
      content: `Generate a complete indices trading strategy for:
${prompt.timeframe ? `Timeframe: ${prompt.timeframe}` : ""}
${prompt.indicators && prompt.indicators.length > 0 ? `Selected Indicators: ${prompt.indicators.join(", ")}` : "Please recommend 3 best indicators"}

Provide:
1. ${prompt.indicators && prompt.indicators.length > 0 ? `Use the selected indicators (${prompt.indicators.join(", ")}) with full parameter settings` : "Recommend 3 best indicators with full parameter settings"}
2. Step-by-step strategy explanation tailored for indices trading
3. 4-6 best indices for current session and volatility
4. Trade plan with entry conditions and expiry durations
5. Structured chart annotations for TradingView Lightweight Charts including:
   - Markers for BUY/SELL signals with exact timestamps, colors (green for BUY, red for SELL), arrow shapes, and proper positioning
   - Indicator overlay data with time-series data points for technical indicators
   - Trend lines with start/end coordinates for support/resistance levels
   - Price zones for overbought/oversold areas with proper color coding

Focus specifically on indices trading with clear BUY/SELL entry signals and provide all chart data in the exact format required for TradingView Lightweight Charts integration.`,
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
        name: "indices_strategy_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            recommendedIndicators: {
              type: "array",
              description:
                "Array of recommended indicators with full parameter settings for indices trading",
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
                      "Full indicator input settings with specific parameters (e.g., EMA → Period: 20, Source: Close)",
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
            recommendedIndices: {
              type: "array",
              description:
                "4-6 best indices for current session and volatility",
              items: {
                type: "object",
                properties: {
                  index: {
                    type: "string",
                    description: "Index symbol (e.g., US30, US100, US500)",
                  },
                  rationale: {
                    type: "string",
                    description:
                      "Brief explanation why this index is optimal for trading in the current session",
                  },
                },
                required: ["index", "rationale"],
                additionalProperties: false,
              },
            },
            tradePlan: {
              type: "object",
              description:
                "Trade plan with entry conditions and expiry durations for indices trading",
              properties: {
                entryConditions: {
                  type: "string",
                  description:
                    "Specific entry conditions for BUY and SELL trades based on indicator signals",
                },
                stopLoss: {
                  type: "string",
                  description: "Stop Loss placement with logic",
                },
                takeProfit: {
                  type: "array",
                  description: "Take Profit levels (TP1, TP2, TP3)",
                  items: {
                    type: "string",
                  },
                },
                timeframe: {
                  type: "string",
                  description: "Recommended timeframe for chart analysis",
                },
                holdingStyle: {
                  type: "string",
                  description: "Recommended holding style (Scalping, Intraday, Swing)",
                },
              },
              required: [
                "entryConditions",
                "stopLoss",
                "takeProfit",
                "timeframe",
                "holdingStyle",
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
                  description: "Chart markers for BUY/SELL signals with timestamps and price levels",
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
                          "Text to display on the marker (e.g., 'BUY', 'SELL')",
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
            "recommendedIndices",
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

export { GetIndicesStrategy };
