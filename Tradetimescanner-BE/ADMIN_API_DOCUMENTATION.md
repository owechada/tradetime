# Admin Panel API Documentation

This document outlines all the available admin API endpoints for the TradeTimeScanner backend application.

## Authentication

All admin routes require:
1. **JWT Token**: Include `Authorization: Bearer <token>` in request headers
2. **Admin Privileges**: User must have `is_admin: 1` in the database

## Base URL
All admin endpoints are prefixed with `/admin`

---

## 📊 Dashboard & Analytics

### GET /admin/dashboard/stats
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "active": 980,
      "inactive": 270,
      "premium": 150,
      "trial": 75,
      "admin": 3,
      "recentRegistrations": 45
    },
    "content": {
      "totalScans": 5420,
      "totalStrategies": 1230
    }
  }
}
```

### GET /admin/system/info
Get system information and health metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "uptime": 86400,
    "memory": {
      "used": 128,
      "total": 256,
      "external": 32
    },
    "node_version": "v18.17.0",
    "platform": "linux"
  }
}
```

---

## 👥 User Management

### GET /admin/users
Get paginated list of users with search and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in username, email, or trade view name
- `status` (string): Filter by status - `all`, `active`, `inactive`, `premium`, `trial`, `admin`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "username": "john_doe",
      "mail": "john@example.com",
      "is_admin": 0,
      "checked": 0,
      "is_sub_before": "NULL",
      "is_trial": "NULL",
      "subExpiryDate": "NULL",
      "trade_view_name": "johntrader"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 10,
    "pages": 125
  }
}
```

### GET /admin/users/:id
Get detailed user information including activity summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "username": "john_doe",
      "mail": "john@example.com",
      // ... other user fields
    },
    "savedScans": 15,
    "savedStrategies": 8
  }
}
```

### PUT /admin/users/:id
Update user information.

**Request Body:**
```json
{
  "username": "new_username",
  "mail": "new@example.com",
  "is_admin": 1,
  "checked": 0,
  "comment": "Updated by admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    // Updated user object
  }
}
```

### DELETE /admin/users/:id
Delete user and all associated data (saved scans and strategies).

**Response:**
```json
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

### PATCH /admin/users/:id/toggle-status
Toggle user active/inactive status.

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": { "checked": 0 }
}
```

### GET /admin/users/:id/activity
Get user's recent activity (saved scans and strategies).

**Response:**
```json
{
  "success": true,
  "data": {
    "savedScans": [
      {
        "id": "scan-id",
        "scanName": "BTC Analysis",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "savedStrategies": [
      {
        "id": "strategy-id",
        "strategyName": "Scalping Strategy",
        "createdAt": "2024-01-14T15:45:00Z"
      }
    ]
  }
}
```

---

## 💎 Premium Management

### POST /admin/users/:id/premium/grant
Grant premium access to a user.

**Request Body:**
```json
{
  "expiryDate": "2024-12-31T23:59:59Z",
  "subscriptionId": "sub_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Premium access granted successfully"
}
```

### DELETE /admin/users/:id/premium/revoke
Revoke premium access from a user.

**Response:**
```json
{
  "success": true,
  "message": "Premium access revoked successfully"
}
```

---

## 🎯 Trial Management

### POST /admin/users/:id/trial/grant
Grant trial access to a user.

**Request Body:**
```json
{
  "trialDays": 14
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trial access granted for 14 days"
}
```

### DELETE /admin/users/:id/trial/revoke
Revoke trial access from a user.

**Response:**
```json
{
  "success": true,
  "message": "Trial access revoked successfully"
}
```

---

## 🔐 Admin Management

### POST /admin/users/:id/admin/promote
Promote user to admin.

**Response:**
```json
{
  "success": true,
  "message": "User promoted to admin successfully"
}
```

### DELETE /admin/users/:id/admin/revoke
Revoke admin privileges from user (cannot revoke own admin privileges).

**Response:**
```json
{
  "success": true,
  "message": "Admin privileges revoked successfully"
}
```

---

## 🔄 Bulk Operations

### PUT /admin/users/bulk/update
Update multiple users at once.

**Request Body:**
```json
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "updateData": {
    "checked": 0,
    "comment": "Bulk updated"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 users updated successfully"
}
```

### DELETE /admin/users/bulk/delete
Delete multiple users and their associated data.

**Request Body:**
```json
{
  "userIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 users and their associated data deleted successfully"
}
```

---

## 📝 User Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UUID primary key |
| `username` | string | User's username |
| `mail` | string | User's email address |
| `is_admin` | number | Admin status (0 = user, 1 = admin) |
| `checked` | number | Account status (0 = active, 1 = inactive) |
| `is_sub_before` | string | Premium subscription status |
| `is_trial` | string | Trial status |
| `trade_view_name` | string | TradingView username |
| `subExpiryDate` | string | Premium subscription expiry |
| `exp_date` | string | Trial expiry date |
| `subscription_id` | string | Payment processor subscription ID |
| `token` | string | User's JWT token |
| `comment` | string | Admin notes about user |
| `activation` | string | Account activation status |
| `ip` | string | User's IP address |
| `mail_chimp` | string | MailChimp integration status |

---

## 🛡️ Security Notes

1. **Admin Authentication**: All endpoints require valid JWT token with admin privileges
2. **Self-Protection**: Admins cannot revoke their own admin privileges
3. **Data Integrity**: Deleting users also removes all associated data (scans, strategies)
4. **Input Validation**: All user inputs are validated and sanitized
5. **Password Security**: Passwords are never returned in API responses

---

## 📋 Usage Examples

### Example: Search for users by email
```bash
GET /admin/users?search=john@example.com&page=1&limit=10
```

### Example: Get all premium users
```bash
GET /admin/users?status=premium&limit=50
```

### Example: Grant 30-day trial to user
```bash
POST /admin/users/uuid-123/trial/grant
Content-Type: application/json

{
  "trialDays": 30
}
```

### Example: Bulk update user status
```bash
PUT /admin/users/bulk/update
Content-Type: application/json

{
  "userIds": ["uuid1", "uuid2"],
  "updateData": {
    "checked": 0,
    "comment": "Reactivated by admin"
  }
}
```

---

## 🚨 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (not admin)
- `404`: Not Found (user doesn't exist)
- `500`: Internal Server Error

---

This admin panel provides comprehensive user management, premium/trial control, bulk operations, and system monitoring capabilities for your TradeTimeScanner application.