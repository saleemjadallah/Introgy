/**
 * Navigation utility functions
 * These functions handle navigation in both web and native environments
 */

/**
 * Navigate to the profile page
 */
export function navigateToProfile() {
  navigateTo('/profile');
}

/**
 * Navigate to the onboarding page
 */
export function navigateToOnboarding() {
  navigateTo('/onboarding');
}

/**
 * Navigate to the auth page
 */
export function navigateToAuth() {
  navigateTo('/auth');
}

/**
 * Navigate to a specific path
 * @param path The path to navigate to
 */
function navigateTo(path: string) {
  // Check if we're in a React environment with history
  if (window.history && window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    // Dispatch a popstate event to trigger React Router
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else {
    // Fallback to direct location change
    window.location.href = path;
  }
}
