# Indicator Options API Documentation

This document outlines the new indicator recommendation endpoint for the TradeTimeScanner backend application.

## Base URL
The indicator options endpoint is available at `/gen/genstrategy/options`

---

## 📊 Indicator Options Endpoint

### POST /gen/genstrategy/options
Get recommended indicators and their optimal settings based on market type and trading timing.

**Request Body:**
```json
{
  "markettype": "OTC Market",
  "timing": "1-Minute Trades and Above"
}
```

**Request Parameters:**
- `markettype` (string, required): The type of market to trade in
  - Examples: "OTC Market", "Forex", "Stock Markets", "Commodity Markets", "Cryptocurrency Exchanges", etc.
- `timing` (string, required): The preferred trading timing/frequency
  - Examples: "1-Minute Trades and Above", "5-Minute Trades", "1-Hour Trades", "Daily Trades", etc.

**Response:**
```json
{
  "recommendedIndicators": [
    {
      "name": "RSI (Relative Strength Index)",
      "settings": "Period: 14, Overbought: 70, Oversold: 30",
      "explanation": "RSI is ideal for OTC markets as it helps identify overbought and oversold conditions in volatile markets. The 14-period setting provides good sensitivity for 1-minute timeframes."
    },
    {
      "name": "MACD (Moving Average Convergence Divergence)",
      "settings": "Fast EMA: 12, Slow EMA: 26, Signal Line: 9",
      "explanation": "MACD works well for trend identification in OTC markets. The standard 12-26-9 settings provide reliable signals for short-term trading."
    },
    {
      "name": "Bollinger Bands",
      "settings": "Period: 20, Standard Deviation: 2",
      "explanation": "Bollinger Bands help identify volatility and potential reversal points in OTC markets. The 20-period with 2 standard deviations is optimal for 1-minute trading."
    },
    {
      "name": "Stochastic Oscillator",
      "settings": "K Period: 14, D Period: 3, Smoothing: 3",
      "explanation": "Stochastic is excellent for momentum trading in volatile OTC markets. The 14-3-3 settings provide quick signals suitable for 1-minute timeframes."
    },
    {
      "name": "Volume Profile",
      "settings": "Session-based, Tick-based calculation",
      "explanation": "Volume Profile helps identify key support and resistance levels in OTC markets, crucial for 1-minute trading decisions."
    }
  ],
  "recommendedtradetime": "Trade during peak OTC market hours (8:00 AM - 5:00 PM EST) when liquidity is highest and spreads are tightest. Avoid trading during low liquidity periods like early morning or late evening.",
  "recommendedtimeframe": "1-minute charts for entry signals, 5-minute charts for trend confirmation, and 15-minute charts for overall market structure analysis.",
  "strategyexplanation": "For OTC market trading with 1-minute timeframes and above, use RSI for overbought/oversold signals, MACD for trend direction, Bollinger Bands for volatility and reversal points, Stochastic for momentum confirmation, and Volume Profile for key levels. Combine these indicators to create a robust trading system that can handle the high volatility and rapid price movements typical in OTC markets."
}
```

---

## 🔗 Integration with Existing Endpoints

### Relationship with /gen/genstrategy
- **`/gen/genstrategy/options`**: Recommends indicators and settings based on market type and timing
- **`/gen/genstrategy`**: Creates a complete trading strategy using specific indicators

### Typical Workflow:
1. **Get Indicator Recommendations**: Call `/gen/genstrategy/options` to get recommended indicators
2. **Generate Strategy**: Use the recommended indicators with `/gen/genstrategy` to create a complete strategy
3. **Save Strategy**: Save the generated strategy using `/api/generated-strategies/save`

**Example Integration:**
```javascript
// Step 1: Get indicator recommendations
const optionsResponse = await fetch('/gen/genstrategy/options', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    markettype: 'OTC Market',
    timing: '1-Minute Trades and Above'
  })
});

const indicatorOptions = await optionsResponse.json();

// Step 2: Generate strategy using recommended indicators
const indicators = indicatorOptions.recommendedIndicators.map(ind => ind.name);
const strategyResponse = await fetch('/gen/genstrategy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      indicators: indicators,
      tradetime: indicatorOptions.recommendedtradetime,
      timeframe: indicatorOptions.recommendedtimeframe
    }
  })
});

const strategy = await strategyResponse.json();

// Step 3: Save the strategy
await fetch('/api/generated-strategies/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userid: 'user123',
    strategyName: 'OTC 1-Minute Strategy',
    ...strategy,
    originalIndicators: indicators.join(','),
    originalTradetime: indicatorOptions.recommendedtradetime,
    originalTimeframe: indicatorOptions.recommendedtimeframe
  })
});
```

---

## 📝 Market Type Examples

### Supported Market Types:
- **OTC Market**: Over-the-counter trading
- **Forex**: Foreign exchange markets
- **Stock Markets**: Equity trading
- **Commodity Markets**: Commodity trading
- **Cryptocurrency Exchanges**: Digital currency trading
- **Index Markets (ETF and Index Funds)**: Index-based trading
- **Futures and Options Markets**: Derivatives trading
- **Bond Markets**: Fixed income trading

### Supported Timing Options:
- **1-Minute Trades and Above**: High-frequency trading
- **5-Minute Trades**: Short-term scalping
- **15-Minute Trades**: Intraday trading
- **1-Hour Trades**: Medium-term intraday
- **4-Hour Trades**: Swing trading
- **Daily Trades**: Position trading
- **Weekly Trades**: Long-term trading

---

## 🎯 Response Structure

The response follows the same structure as the `/gen/genstrategy` endpoint, making it compatible with the existing strategy saving system:

- **`recommendedIndicators`**: Array of indicator objects with name, settings, and explanation
- **`recommendedtradetime`**: Recommended trading time based on market type and timing
- **`recommendedtimeframe`**: Recommended timeframe for the trading approach
- **`strategyexplanation`**: Overall explanation of the recommended approach

---

## 📝 Error Responses

Consistent error responses across all endpoints:

```json
{
  "message": "Missing required fields: markettype and timing are required"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error
