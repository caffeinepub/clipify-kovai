# Clipify Kovai

## Current State
Admin panel uses Internet Identity for login, then checks `isCallerAdmin()` on the backend. The admin token must be passed via URL hash on first login. Users are getting "Access Denied" because they never initialized with the token.

## Requested Changes (Diff)

### Add
- Backend: `checkAdminPassword(password: Text) : async Bool` -- checks password against stored hash
- Backend: `setAdminPassword(currentPassword: Text, newPassword: Text) : async Bool` -- change password (requires knowing current)
- Backend: stored admin password (default: `clipify2024`)
- Frontend: password-based login form replacing Internet Identity
- Frontend: "Change Password" option in admin panel

### Modify
- AdminPage.tsx: remove Internet Identity login, replace with simple password input form
- AdminPage.tsx: use sessionStorage to track admin session (key: `clipify_admin_auth`)
- AdminPage.tsx: admin panel shows if sessionStorage has valid auth flag
- useActor.ts: use anonymous actor for admin (no Internet Identity needed)

### Remove
- Internet Identity login flow from admin page
- Admin token URL parameter dependency for admin access

## Implementation Plan
1. Add `checkAdminPassword` and `setAdminPassword` to backend, store password as Text stable var with default
2. Update AdminPage to show password form, store auth in sessionStorage, call `checkAdminPassword`
3. Add "Change Password" dialog in admin settings
4. Keep anonymous actor for admin (no identity needed)
