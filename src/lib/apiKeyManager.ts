/**
 * SECURITY NOTE: API Key Management
 * 
 * This module stores API keys in browser localStorage for convenience.
 * While this is acceptable for development, be aware of the following:
 * 
 * - localStorage is accessible via browser DevTools
 * - Values persist across sessions and can be extracted
 * - For production, consider restricting API keys via Google Cloud Console
 *   to specific domains/referrers
 * 
 * Best practice: Configure domain restrictions for your API key in 
 * Google Cloud Console to limit usage to your application domain only.
 */

const STORAGE_KEY = 'gm_api_key_secure';

export const apiKeyManager = {
  // Initialize the API key - call this once when setting up the app
  initializeAPIKey: (apiKey: string): void => {
    try {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } catch (e) {
      console.warn('Failed to store API key');
    }
  },

  // Get the stored API key
  getAPIKey: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to retrieve API key');
      return null;
    }
  },

  // Check if API key is configured
  isConfigured: (): boolean => {
    return !!apiKeyManager.getAPIKey();
  },

  // Clear the API key (for logout or reset)
  clearAPIKey: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear API key');
    }
  }
};
