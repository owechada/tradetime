# TradeTimeScanner Backend API Documentation

Welcome to the TradeTimeScanner Backend API documentation. This system handles authentication, trading strategy generation (Forex, Crypto, Gold, Indices, Options), strategy persistence, and advanced AI-powered chart analysis.

## Base URL
Default local development: `http://localhost:3000`

---

## 1. Authentication (`/auth`)
Endpoints for user management and session handling.

### POST `/auth/signup`
Creates a new user account.
- **Body**: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`

### POST `/auth/login`
Authenticates a user and returns a token.
- **Body**: `{ "email": "user@example.com", "password": "password123" }`

### POST `/auth/google-login`
Authenticates a user via Google OAuth.
- **Body**: `{ "idToken": "google-id-token" }`

### POST `/auth/resetpass`
Handles password reset requests.
- **Body**: `{ "email": "user@example.com", "newPassword": "newPassword123" }`

---

## 2. Strategy Generation (`/gen`)
Core features for generating trading signals and indicators.

### POST `/gen/getcurrencypair`
Fetches a list of currency pairs based on market type.
- **Body**: `{ "marketType": "Forex" }`

### POST `/gen/getstable`
Returns stable or recommended pairs.
- **Body**: `{ "frequency": "1H", "market": "Forex" }`

### POST `/gen/gettradesignal`
Generates real-time trading signals.
- **Body**: `{ "pair": "EURUSD", "timeframe": "15m" }`

### POST `/gen/genstrategy`
Basic strategy generator.
- **Body**: `{ "marketType": "Forex", "timeframe": "1H" }`

### POST `/gen/genstrategy/options`
Specialized options trading strategy generation.
- **Body**: `{ "indicator": "Bollinger Bands", "timeframe": "5m" }`

### POST `/gen/genstrategy/forex`
Forex specific strategy generation.
- **Body**: `{ "pair": "GBPUSD", "timeframe": "4H" }`

### POST `/gen/genstrategy/crypto`
Crypto specific strategy generation.
- **Body**: `{ "coin": "BTC", "timeframe": "1D" }`

### POST `/gen/genstrategy/gold`
Gold/XAUUSD specific strategy generation.

### POST `/gen/genstrategy/indices`
Market indices strategy generation.

---

## 3. Strategy Storage & Management (`/api/strategies` & `/api/generated-strategies`)
Managing saved and generated strategies.

### `/api/strategies`
- **GET `/`**: Retrieve all saved strategies.
- **POST `/`**: Save a new strategy.
- **GET `/:userid`**: Get strategies by User ID.
- **GET `/:id`**: Get a specific strategy by ID.
- **PUT `/:id`**: Update a strategy.
- **DELETE `/:id`**: Delete a strategy.

### `/api/generated-strategies`
- **POST `/save`**: Persist a generated strategy to the database.
- **GET `/user/:userid`**: List all generated strategies for a user.
- **GET `/all`**: Admin endpoint to see all generations.
- **GET `/:id`**: Fetch specific generation details.

---

## 4. Pro Chart Analysis (`/api/pro-chart`)
AI-powered analysis of uploaded chart images.

### POST `/api/pro-chart/analyze`
Analyzes a chart image (Multipart/form-data).
- **Field**: `chart` (File)
- **Field**: `userId` (String)
- **Field**: `analysisType` (Optional: "Standard" | "Option")

### GET `/api/pro-chart/history/:userId`
Retrieves previous chart analysis results for a specific user.

---

## 5. Admin Endpoints (`/admin`)
System management and user moderation.

### Dashboard
- **GET `/admin/dashboard/stats`**: High-level system statistics.
- **GET `/admin/system/info`**: Server and environment information.

### User Moderation
- **GET `/admin/users`**: List all users.
- **PATCH `/admin/users/:id/toggle-status`**: Enable/Disable user account.
- **POST `/admin/users/:id/premium/grant`**: Manually grant premium status.
- **DELETE `/admin/users/:id/premium/revoke`**: Revoke premium status.

---

## 6. Trade Time Endpoints (`/api/tradetime`)
Handles session information and market timing.

### POST `/api/tradetime/analyze`
Analyzes current market timing.

---

## 7. Testing & Maintenance (`/test`)
Utility endpoints for verification.

### GET `/test/ping`
Check if the server and OpenAI configuration are active.

### POST `/test/chart-generation-test`
Triggers a test of the DALL-E chart generation service.
