# Supabase Authentication Settings for Deep Linking

Follow these steps to update your Supabase authentication settings to support deep linking:

1. Log in to the [Supabase Dashboard](https://app.supabase.com)
2. Select your project: "Introgy"
3. Go to "Authentication" in the left sidebar
4. Click on "URL Configuration"
5. Update the following settings:

## Site URL
- Set to: `https://introgy.ai`

## Redirect URLs
Add the following URLs:
- `https://introgy.ai/auth/callback`
- `introgy://auth/callback`

This will allow Supabase to redirect back to your app using the custom URL scheme.

## Save Changes
- Click "Save" to apply the changes

## For Google OAuth Provider
1. Go to "Authentication" > "Providers" > "Google"
2. Make sure Google is enabled
3. Verify that your Google OAuth credentials (Client ID and Secret) are correctly configured
4. In your Google Cloud Console, make sure the following redirect URIs are added:
   - `https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback`
   - `https://introgy.ai/auth/callback`

These changes will ensure that the OAuth flow can properly redirect back to your app.
