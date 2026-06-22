# Free Trial API Documentation

## Overview

This document describes the free trial management endpoints that allow administrators to control user access to the 3-day free trial feature.

## Implementation Details

- Uses existing `subExpiryDate` field to track free trial usage
- `subExpiryDate: "0"` = User hasn't taken free trial
- `subExpiryDate: "1"` = User has taken free trial
- This field is separate from the existing `is_trial` field which tracks current trial status

## Endpoints

### 1. Check Free Trial Status

**GET** `/admin/users/:id/free-trial/status`

Returns the current free trial status of a user.

**Response:**

```json
{
  "success": true,
  "data": {
    "has_taken_free_trial": false,
    "can_take_free_trial": true,
    "current_trial_status": "NULL",
    "trial_expiry": "NULL"
  }
}
```

### 2. Toggle Free Trial Status

**PATCH** `/admin/users/:id/free-trial/toggle`

Toggles whether a user can take a free trial or not.

**Response:**

```json
{
  "success": true,
  "message": "Free trial status enabled successfully",
  "data": {
    "has_taken_free_trial": true,
    "can_take_free_trial": false
  }
}
```

## How It Works

1. **Initial State**: New users have `subExpiryDate: "0"` by default (can take free trial)
2. **Granting Trial**: When an admin grants a trial via `/admin/users/:id/trial/grant`, the system automatically sets `subExpiryDate: "1"` (has taken free trial)
3. **Revoking Trial**: When an admin revokes a trial via `/admin/users/:id/trial/revoke`, the trial status is reset but `subExpiryDate: "1"` remains (preventing reuse)
4. **Resetting**: Admins can use the toggle endpoint to reset a user's free trial eligibility by setting `subExpiryDate: "0"`

## Use Cases

- **Prevent Abuse**: Users can only take one free trial per account
- **Admin Control**: Admins can manually enable/disable free trial access
- **Audit Trail**: Track which users have used their free trial
- **Flexibility**: Admins can reset eligibility if needed

## Integration with Existing Trial System

The free trial tracking works alongside the existing trial system:

- `is_trial`: Current trial status (active/inactive)
- `exp_date`: Trial expiration date
- `subExpiryDate`: Free trial usage tracking ("0" = can take trial, "1" = has taken trial)

## Example Workflow

1. User registers → `subExpiryDate: "0"` (can take free trial)
2. Admin grants 3-day trial → `is_trial: "true"`, `subExpiryDate: "1"` (has taken trial)
3. Trial expires → `is_trial: "NULL"`, `subExpiryDate: "1"` (remains, preventing reuse)
4. Admin can toggle to reset → `subExpiryDate: "0"` (user can take trial again)

## Database Field Usage

The system uses the existing `subExpiryDate` field in the users table:

- **Value**: `"0"` or `"1"` (stored as strings)
- **Default**: `"0"` for new users
- **Purpose**: Track whether user has ever taken a free trial
- **Persistence**: Remains set even after trial expires

## API Integration

These endpoints integrate with the existing admin system:

- **Authentication**: Uses existing admin authentication
- **User Management**: Works with existing user CRUD operations
- **Trial System**: Complements existing trial grant/revoke functionality
- **Audit**: Provides clear tracking of free trial usage
