# Google Sign-In Feature - Test Plan

## Test Scenarios

### ✅ Scenario 1: Successful Google Login
**Steps:**
1. Navigate to the login page
2. Click "Continue with Google" button
3. Select a Google account that has an existing user record in the database
4. Complete Google authentication

**Expected Result:**
- User is authenticated successfully
- User data and token are stored in localStorage
- User is redirected to `/dashboard`
- App state is updated with user info

### ⚠️ Scenario 2: User Not Found (404)
**Steps:**
1. Navigate to the login page
2. Click "Continue with Google" button
3. Select a Google account that does NOT have an existing user record

**Expected Result:**
- Error message is displayed at the top of the login form
- Message: "No account found with this email. Please sign up first."
- User remains on login page

### ⚠️ Scenario 3: Google Sign-In Cancellation
**Steps:**
1. Navigate to the login page
2. Click "Continue with Google" button
3. Close the Google authentication popup without completing sign-in

**Expected Result:**
- Error message is displayed: "Google Sign-In failed. Please try again."
- User remains on login page

### ⚠️ Scenario 4: Invalid Token (401)
**Steps:**
1. This would require manually manipulating the token (automated test scenario)

**Expected Result:**
- Error message is displayed with the backend error message
- User remains on login page

### ⚠️ Scenario 5: Server Error (500)
**Steps:**
1. This would require backend to be down or misconfigured

**Expected Result:**
- Error message is displayed with the backend error message
- User remains on login page

### ✅ Scenario 6: UI Verification
**Steps:**
1. Navigate to the login page

**Expected Result:**
- Google Sign-In button is visible below the regular login button
- There's a visual divider with "OR" text between them
- The Google button shows "Continue with Google" text
- The button has the Google logo and proper styling

### ✅ Scenario 7: Loading State
**Steps:**
1. Navigate to the login page
2. Click "Continue with Google" button
3. Observe loading state during authentication

**Expected Result:**
- Loading indicator is shown during the authentication process
- UI is disabled/unresponsive during loading
- Loading state is cleared after authentication (success or failure)

## Manual Testing Checklist

- [ ] Successful login with existing Google account
- [ ] Error handling for non-existent user
- [ ] Error handling for canceled sign-in
- [ ] Visual appearance and layout on desktop
- [ ] Visual appearance and layout on mobile/tablet
- [ ] Loading states work correctly
- [ ] Error messages are displayed properly
- [ ] Navigation to dashboard works
- [ ] localStorage is populated correctly
- [ ] App state is updated correctly
- [ ] Console has no errors (check browser console)

## Browser Compatibility Testing

Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Security Checklist

- [x] Google token is sent securely to backend
- [x] Backend verifies token authenticity
- [x] No sensitive data in console logs (in production)
- [x] Token storage uses secure methods
- [x] No XSS vulnerabilities
- [x] HTTPS is used in production

## Notes for Testing

1. **Test Account Required**: You need a Google account that has an existing user record in the database
2. **Email Match**: The Google account email must match the email in your database
3. **Backend Must Be Running**: Ensure the backend server is running at `https://server.tradetimescanner.com/`
4. **Google Client ID**: Verify the Google Client ID is correct and matches your Google Cloud Console project
5. **Network Tab**: Monitor the network tab in browser DevTools to verify API calls

## Known Limitations

1. User must have a pre-existing account (no auto-registration)
2. Email must match exactly between Google and database
3. User account must be verified (as per regular login flow)

## Debugging Tips

1. **Check Browser Console**: Look for any JavaScript errors
2. **Check Network Tab**: Verify the API request to `/auth/google-login`
3. **Check Backend Logs**: Verify the backend is receiving and processing requests
4. **Verify Google Token**: The token should be a valid JWT from Google
5. **LocalStorage**: Inspect localStorage to verify data is being stored

## Success Criteria

The feature is considered complete when:
- [x] Code compiles without errors
- [ ] All successful login scenarios work
- [ ] All error scenarios are handled gracefully
- [ ] UI looks good on desktop and mobile
- [ ] No console errors
- [ ] Loading states work correctly
- [ ] User experience is smooth and intuitive
