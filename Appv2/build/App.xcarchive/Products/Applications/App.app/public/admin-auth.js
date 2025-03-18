// Admin authentication script for Introgy app
import { supabase } from '../../src/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

// Admin account details
const ADMIN_PHONE = '+971507493651';
const ADMIN_PASSWORD = 'admin123'; // You should change this to a secure password

// Store authentication state
const AUTH_KEY = 'introgy_admin_auth';

/**
 * Initialize admin authentication
 * This will check if admin is already signed in, and if not, will attempt to sign in
 */
export async function initAdminAuth() {
  console.log('Initializing admin authentication...');
  
  try {
    // Check if we have a stored session
    const { value } = await Preferences.get({ key: AUTH_KEY });
    
    if (value) {
      console.log('Found stored admin session, validating...');
      // We have a stored session, validate it
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Admin session is valid');
        return true;
      } else {
        console.log('Stored session is invalid, signing in again...');
      }
    }
    
    // No valid session, sign in
    return await signInAdmin();
  } catch (error) {
    console.error('Admin auth initialization error:', error);
    return false;
  }
}

/**
 * Sign in as admin
 */
async function signInAdmin() {
  try {
    console.log(`Signing in admin with phone: ${ADMIN_PHONE}`);
    
    // First try password-based sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD
    });
    
    if (error) {
      console.log('Admin sign in failed, trying to create account:', error);
      
      // If sign in fails, try to create the account
      return await createAdminAccount();
    }
    
    // Store the session
    await Preferences.set({
      key: AUTH_KEY,
      value: 'true'
    });
    
    console.log('Admin signed in successfully:', data.user?.id);
    return true;
  } catch (error) {
    console.error('Admin sign in error:', error);
    return false;
  }
}

/**
 * Create admin account if it doesn't exist
 */
async function createAdminAccount() {
  try {
    console.log('Creating admin account...');
    
    const { data, error } = await supabase.auth.signUp({
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          display_name: 'Admin User',
          is_admin: true
        }
      }
    });
    
    if (error) {
      console.error('Failed to create admin account:', error);
      return false;
    }
    
    // Store the session
    await Preferences.set({
      key: AUTH_KEY,
      value: 'true'
    });
    
    console.log('Admin account created successfully:', data.user?.id);
    return true;
  } catch (error) {
    console.error('Admin account creation error:', error);
    return false;
  }
}

/**
 * Check if user is signed in as admin
 */
export async function isAdminSignedIn() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Admin session check error:', error);
    return false;
  }
}

/**
 * Sign out admin
 */
export async function signOutAdmin() {
  try {
    await supabase.auth.signOut();
    await Preferences.remove({ key: AUTH_KEY });
    return true;
  } catch (error) {
    console.error('Admin sign out error:', error);
    return false;
  }
}
