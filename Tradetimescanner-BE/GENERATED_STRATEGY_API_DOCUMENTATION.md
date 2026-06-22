# Generated Strategy API Documentation

This document outlines the API endpoints for managing generated trading strategies.

## Base URL
All generated strategy endpoints are prefixed with `/api/generated-strategies`

---

## 📈 Generated Strategy Endpoints

### POST /api/generated-strategies/save
Save a generated trading strategy.

**Request Body:**
```json
{
  "userid": "string",
  "strategyName": "string (optional)",
  "recommendedIndicators": [
    {
      "name": "string",
      "explanation": "string"
    }
  ],
  "recommendedtradetime": "string",
  "recommendedtimeframe": "string",
  "strategyexplanation": "string",
  "originalIndicators": "string (optional)",
  "originalTradetime": "string (optional)",
  "originalTimeframe": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Strategy saved successfully",
  "data": {
    "id": 1,
    "userid": "user123",
    "strategyName": "My Trading Strategy",
    "recommendedIndicators": [
      {
        "name": "RSI",
        "explanation": "Relative Strength Index with 14 period"
      }
    ],
    "recommendedtradetime": "09:00-17:00",
    "recommendedtimeframe": "1H",
    "strategyexplanation": "This strategy uses RSI for overbought/oversold conditions",
    "originalIndicators": "RSI,MACD",
    "originalTradetime": "09:00-17:00",
    "originalTimeframe": "1H",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/generated-strategies/user/:userid
Get all generated strategies for a specific user.

**Response:**
```json
{
  "success": true,
  "message": "Strategies retrieved successfully",
  "data": [
    {
      "id": 1,
      "userid": "user123",
      "strategyName": "My Trading Strategy",
      "recommendedIndicators": [
        {
          "name": "RSI",
          "explanation": "Relative Strength Index with 14 period"
        }
      ],
      "recommendedtradetime": "09:00-17:00",
      "recommendedtimeframe": "1H",
      "strategyexplanation": "This strategy uses RSI for overbought/oversold conditions",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /api/generated-strategies/:id
Get a specific generated strategy by ID.

**Response:**
```json
{
  "success": true,
  "message": "Strategy retrieved successfully",
  "data": {
    "id": 1,
    "userid": "user123",
    "strategyName": "My Trading Strategy",
    "recommendedIndicators": [
      {
        "name": "RSI",
        "explanation": "Relative Strength Index with 14 period"
      }
    ],
    "recommendedtradetime": "09:00-17:00",
    "recommendedtimeframe": "1H",
    "strategyexplanation": "This strategy uses RSI for overbought/oversold conditions",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /api/generated-strategies/:id
Update a generated strategy.

**Request Body:** (Same as POST, all fields optional except for updates)

**Response:**
```json
{
  "success": true,
  "message": "Strategy updated successfully",
  "data": {
    "id": 1,
    "userid": "user123",
    "strategyName": "Updated Strategy Name",
    "recommendedIndicators": [
      {
        "name": "RSI",
        "explanation": "Updated explanation"
      }
    ],
    "recommendedtradetime": "10:00-18:00",
    "recommendedtimeframe": "4H",
    "strategyexplanation": "Updated strategy explanation",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### DELETE /api/generated-strategies/:id
Delete a generated strategy.

**Response:**
```json
{
  "success": true,
  "message": "Strategy deleted successfully"
}
```

### GET /api/generated-strategies/all
Get all generated strategies (Admin endpoint).

**Response:**
```json
{
  "success": true,
  "message": "All strategies retrieved successfully",
  "data": [
    {
      "id": 1,
      "userid": "user123",
      "strategyName": "My Trading Strategy",
      "recommendedIndicators": [
        {
          "name": "RSI",
          "explanation": "Relative Strength Index with 14 period"
        }
      ],
      "recommendedtradetime": "09:00-17:00",
      "recommendedtimeframe": "1H",
      "strategyexplanation": "This strategy uses RSI for overbought/oversold conditions",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🔗 Integration with /gen/genstrategy

To save a strategy generated from the `/gen/genstrategy` endpoint:

1. **Generate Strategy**: Call `/gen/genstrategy` with your indicators, trade time, and timeframe
2. **Save Strategy**: Use the response from step 1 to call `/api/generated-strategies/save`

**Example Integration:**
```javascript
// Step 1: Generate strategy
const generateResponse = await fetch('/gen/genstrategy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    indicators: ['RSI', 'MACD'],
    tradetime: '09:00-17:00',
    timeframe: '1H'
  })
});

const generatedStrategy = await generateResponse.json();

// Step 2: Save the generated strategy
const saveResponse = await fetch('/api/generated-strategies/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userid: 'user123',
    strategyName: 'My Custom Strategy',
    ...generatedStrategy, // Use the generated strategy data
    originalIndicators: 'RSI,MACD',
    originalTradetime: '09:00-17:00',
    originalTimeframe: '1H'
  })
});
```

---

## 📝 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (missing required fields)
- `404` - Not Found (strategy doesn't exist)
- `500` - Internal Server Error
